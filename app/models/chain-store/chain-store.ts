import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import BigNumber from "bignumber.js"

import { withEnvironment } from "../extensions"
import { BigNumberPrimitive } from "../number"
import {
  parseValidatorResult,
  ValidatorModel,
  Validator,
} from "../validator"
import { WalletModel } from "../wallet"
import {
  CosmosCoinResult,
  CosmosDelegation,
  CosmosRedelegation,
  CosmosRewardsResult,
  CosmosUnbondingDelegation,
  CosmosValidator,
  CosmosValidatorReward,
} from "../../services/cosmos"
import {
  calculateUnbondingDelegationBalanceFromResultEntries,
  extractCoinFromCosmosCoinList,
} from "../../services/cosmos/cosmos.utils"

import { logError } from "../../utils/error"

/**
 * Cosmos Chain Store
 */
export const ChainStoreModel = types
  .model("ChainStore")
  .props({
    id: types.identifier,
    denom: types.frozen(types.string),
    fractionDenom: types.frozen(types.string),
    fractionDigits: types.frozen(types.number),
    gasPrice: BigNumberPrimitive,

    annualProvision: types.optional(BigNumberPrimitive, "0"),
    validators: types.optional(types.map(types.late(() => ValidatorModel)), {}),

    wallets: types.map(WalletModel),
    currentWallet: types.maybe(types.safeReference(WalletModel)),
  })
  .volatile(() => ({
    isFetchingValidators: false,
    isFetchingBalance: false,
    isFetchingDelegation: false,
    isFetchingRedelegation: false,
    isFetchingUnbondingDelegation: false,
    isFetchingRewards: false,
  }))
  .extend(withEnvironment)
  .views(self => ({
    toDenom(value: BigNumber = new BigNumber(0)) {
      return value.shiftedBy(-self.fractionDigits)
    },
    formatPercent(value: BigNumber) {
      return value
        .times(100)
        .toFixed(2)
        .concat("%")
    },
    get wallet() {
      return self.currentWallet
    },
    get validatorList() {
      return [...self.validators.values()]
    },
    get isLoading() {
      return self.isFetchingValidators ||
        self.isFetchingBalance ||
        self.isFetchingDelegation ||
        self.isFetchingRedelegation ||
        self.isFetchingUnbondingDelegation ||
        self.isFetchingRewards
    },
  }))
  .views(self => ({
    formatDenom(
      value: BigNumber,
      decimalPlaces?: number,
      showUnit = true,
      roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_CEIL,
      format?: BigNumber.Format
    ) {
      const formattedValue = self.toDenom(value)
        .toFormat(decimalPlaces, roundingMode, format)
      return showUnit ? formattedValue.concat(` ${self.denom}`) : formattedValue
    },
    get totalDelegatorShares() {
      return self.validatorList.reduce(
        (total, v) => total.plus(v.totalDelegatorShares),
        new BigNumber(0)
      )
    },
  }))
  .views(self => ({
    formatBalance(balance: BigNumber, showUnit?: boolean) {
      return self.formatDenom(balance, 4, showUnit)
    },
    formatBalanceShort(balance: BigNumber, showUnit?: boolean) {
      return self.formatDenom(balance, 2, showUnit)
    },
    getValidatorVotingPowerPercentage(validator: Validator) {
      return self.formatPercent(
        validator.totalDelegatorShares
          .div(self.totalDelegatorShares)
      )
    },
    /**
     * The share of all provisioned block rewards all delegators of this validator get
     */
    delegatorProvisionShare(validator: Validator) {
      const validatorProvisionShare = validator.tokens.div(self.totalDelegatorShares)
      return validatorProvisionShare.times(new BigNumber(1).minus(validator.commissionRate))
    },
  }))
  .views(self => ({
    formatRewards(rewards: BigNumber) {
      return (rewards.isGreaterThan(0) ? "+" : "").concat(self.formatBalance(rewards, false))
    },
    get formattedTotalBalance() {
      return self.formatBalance(self.wallet.totalBalance, false)
    },
    get formattedConciseTotalBalance() {
      const balanceInDenom = self.toDenom(self.wallet.totalBalance)
      if (balanceInDenom.isGreaterThan(0) && balanceInDenom.isLessThan(1)) {
        return `< 1 ${self.denom}`
      }
      return self.formatDenom(self.wallet.totalBalance, 0, true, BigNumber.ROUND_FLOOR)
    },
    get formattedAvailableBalance() {
      return self.formatBalance(self.wallet.availableBalance)
    },
    get formattedUnbondingBalance() {
      return self.formatBalance(self.wallet.unbondingBalance, false)
    },
    /**
     * Calculate expected rewards if delegator stakes `x` tokens
     *
     * @param delegatedTokens The delegated tokens of a delegator
     * @return The annual rewards for a delegator
     */
    calculateExpectedRewards(validator: Validator, delegatedTokens: BigNumber = new BigNumber(1)) {
      const annualAllDelegatorRewards = self.delegatorProvisionShare(validator).times(self.annualProvision)
      const annualDelegatorRewardsShare = delegatedTokens.div(validator.tokens)
      const annualDelegatorRewards = annualDelegatorRewardsShare.times(annualAllDelegatorRewards)
      return annualDelegatorRewards
    },
  }))
  .views(self => ({
    get formattedRewardsBalance() {
      return self.formatRewards(self.wallet.rewardsBalance)
    },
    /**
     * Get simplified expected rewards in percent
     * Ref: https://github.com/luniehq/lunie/blob/ecf75e07c6e673434a87e9e5b2e5e5290c5b1667/src/scripts/returns.js
     *
     * @return The percentage of the returns
     */
    getValidatorExpectedReturnsRate(validator: Validator) {
      const delegatedTokens = new BigNumber(1e10)
      return self.calculateExpectedRewards(validator, delegatedTokens).div(delegatedTokens)
    },
    getValidatorExpectedReturnsPercentage(validator: Validator) {
      return self.formatPercent(this.getValidatorExpectedReturnsRate(validator))
    },
  }))
  .views(self => ({
    compareValidatorsByDelegation(a: Validator, b: Validator) {
      // Sort by delegated amount
      const aDelegation = self.wallet.getDelegation(a.operatorAddress)
      const bDelegation = self.wallet.getDelegation(b.operatorAddress)
      if (aDelegation.hasDelegated) {
        if (bDelegation.hasDelegated) {
          if (aDelegation.shares.isGreaterThan(bDelegation.shares)) return -1
          if (aDelegation.shares.isLessThan(bDelegation.shares)) return 1
        } else {
          return -1
        }
      } else if (bDelegation.hasDelegated) {
        return 1
      }

      // Sort by expected returns
      const aExpectedReturns = self.calculateExpectedRewards(a)
      const bExpectedReturns = self.calculateExpectedRewards(b)
      if (aExpectedReturns.isGreaterThan(bExpectedReturns)) return -1
      if (aExpectedReturns.isLessThan(bExpectedReturns)) return 1

      // Sort by voting power
      if (a.totalDelegatorShares.isLessThan(b.totalDelegatorShares)) return -1
      if (a.totalDelegatorShares.isGreaterThan(b.totalDelegatorShares)) return 1

      // Sort by name
      return a.moniker.localeCompare(b.moniker)
    },
    get sortedValidatorList() {
      return self.validatorList.sort(this.compareValidatorsByDelegation)
    },
  }))
  .actions(self => ({
    setupWallet(address: string) {
      let wallet = self.wallets.get(address)
      if (!wallet) {
        wallet = WalletModel.create({ address })
        self.wallets.put(wallet)
      }
      self.currentWallet = wallet
    },
    setDelegation(
      type: "shares" | "unbonding" | "rewards",
      validatorAddress: string,
      value: BigNumber
    ) {
      self.wallet.getDelegation(validatorAddress, false)[type] = value
    },
    setDelegations(
      type: "shares" | "unbonding" | "rewards",
      results: any[] = [],
      reducer: (acc: Map<string, BigNumber>, result: typeof results[0]) => typeof acc
    ) {
      const balanceMap = results.reduce<Map<string, BigNumber>>(reducer, new Map<string, BigNumber>())
      self.validatorList.forEach(({ operatorAddress: id }) => {
        this.setDelegation(type, id, balanceMap.has(id) ? balanceMap.get(id) : new BigNumber(0))
      })
    },
    fetchAnnualProvision: flow(function * () {
      try {
        self.annualProvision = new BigNumber(yield self.env.cosmosAPI.queryAnnualProvision())
      } catch (error) {
        logError(`Error occurs in ChainStore.fetchAnnualProvision: ${error}`)
      }
    }),
    fetchValidators: flow(function * () {
      self.isFetchingValidators = true
      try {
        const rawValidators: CosmosValidator[] = yield self.env.cosmosAPI.getValidators()
        rawValidators.forEach((rawValidator) => {
          let validator = self.validators.get(rawValidator.operator_address)
          if (!validator) {
            validator = ValidatorModel.create(parseValidatorResult(rawValidator), self.env)
            self.validators.put(validator)
          } else {
            validator.update(rawValidator)
          }
          validator.fetchAvatarURL()
        })
      } catch (error) {
        logError(`Error occurs in ChainStore.fetchValidators: ${error}`)
      } finally {
        self.isFetchingValidators = false
      }
    }),
    fetchBalance: flow(function * () {
      self.isFetchingBalance = true
      try {
        self.wallet.availableBalance = new BigNumber(yield self.env.cosmosAPI.queryBalance(self.wallet.address, self.fractionDenom))
      } catch (error) {
        logError(`Error occurs in ChainStore.fetchBalance: ${error}`)
      } finally {
        self.isFetchingBalance = false
      }
    }),
  }))
  .actions(self => ({
    fetchDelegations: flow(function * () {
      self.isFetchingDelegation = true
      try {
        const results: CosmosDelegation[] = yield self.env.cosmosAPI.getDelegations(self.wallet.address)
        self.setDelegations(
          "shares",
          results,
          (delegations, { validator_address: id, shares }: CosmosDelegation) =>
            delegations.set(id, new BigNumber(shares))
        )
      } catch (error) {
        logError(`Error occurs in ChainStore.fetchDelegations: ${error}`)
      } finally {
        self.isFetchingDelegation = false
      }
    }),
    fetchDelegation: flow(function * (validatorAddress: string) {
      const validator = self.validators.get(validatorAddress)
      if (!validator) return

      validator.isFetchingDelegation = true
      try {
        const result: CosmosDelegation = yield self.env.cosmosAPI.getDelegation(self.wallet.address, validator.operatorAddress)
        self.setDelegation("shares", validator.operatorAddress, new BigNumber(result.shares))
      } catch (error) {
        logError(`Error occurs in ChainStore.fetchDelegation: ${error}`)
      } finally {
        validator.isFetchingDelegation = false
      }
    }),
    fetchRedelegations: flow(function * () {
      self.isFetchingRedelegation = true
      try {
        const results: CosmosRedelegation[] = yield self.env.cosmosAPI.getRedelegations(self.wallet.address)
        const destinationValidators = new Set(results.map(r => r.validator_dst_address))
        self.validatorList.forEach(({ operatorAddress: address }) => {
          self.wallet.redelegationTargets.set(address, destinationValidators.has(address))
        })
      } catch (error) {
        logError(`Error occurs in ChainStore.fetchRedelegations: ${error}`)
      } finally {
        self.isFetchingRedelegation = false
      }
    }),
    fetchUnbondingDelegations: flow(function * () {
      self.isFetchingUnbondingDelegation = true
      try {
        const results: CosmosUnbondingDelegation[] = yield self.env.cosmosAPI.getUnbondingDelegations(self.wallet.address)
        self.setDelegations(
          "unbonding",
          results,
          (unbondingDelegations, { validator_address: id, entries }: CosmosUnbondingDelegation) =>
            unbondingDelegations.set(id, calculateUnbondingDelegationBalanceFromResultEntries(entries))
        )
      } catch (error) {
        logError(`Error occurs in ChainStore.fetchUnbondingDelegations: ${error}`)
      } finally {
        self.isFetchingUnbondingDelegation = false
      }
    }),
    fetchUnbondingDelegation: flow(function * (validatorAddress: string) {
      const validator = self.validators.get(validatorAddress)
      if (!validator) return

      validator.isFetchingUnbondingDelegation = true
      try {
        const results: CosmosUnbondingDelegation = yield self.env.cosmosAPI.getUnbondingDelegation(self.wallet.address, validatorAddress)
        if (results) {
          const balance = calculateUnbondingDelegationBalanceFromResultEntries(results.entries)
          self.setDelegation("unbonding", validator.operatorAddress, balance)
        }
      } catch (error) {
        logError(`Error occurs in ChainStore.fetchUnbondingDelegation: ${error}`)
      } finally {
        validator.isFetchingUnbondingDelegation = false
      }
    }),
    fetchRewards: flow(function * () {
      self.isFetchingRewards = true
      try {
        const result: CosmosRewardsResult = yield self.env.cosmosAPI.queryRewards(self.wallet.address)
        self.setDelegations(
          "rewards",
          result.rewards || [],
          (rewards, { validator_address: id, reward }: CosmosValidatorReward) =>
            rewards.set(id, new BigNumber(extractCoinFromCosmosCoinList(reward, self.fractionDenom)))
        )
      } catch (error) {
        logError(`Error occurs in ChainStore.fetchRewards: ${error}`)
      } finally {
        self.isFetchingRewards = false
      }
    }),
    fetchRewardsFromValidator: flow(function * (validatorAddress: string) {
      const validator = self.validators.get(validatorAddress)
      if (!validator) return

      validator.isFetchingRewards = true
      try {
        const results: CosmosCoinResult[] = yield self.env.cosmosAPI.queryRewardsFromValidator(self.wallet.address, validatorAddress)
        const rewards = new BigNumber(extractCoinFromCosmosCoinList(results, self.fractionDenom))
        self.setDelegation("rewards", validator.operatorAddress, rewards)
      } catch (error) {
        logError(`Error occurs in ChainStore.fetchRewardsFromValidator: ${error}`)
      } finally {
        validator.isFetchingRewards = false
      }
    }),
  }))
  .actions(self => ({
    fetchAll: flow(function * () {
      self.fetchBalance()
      yield self.fetchAnnualProvision()
      yield self.fetchValidators()
      self.fetchDelegations()
      self.fetchRedelegations()
      self.fetchUnbondingDelegations()
      self.fetchRewards()
    }),
  }))

type ChainStoreType = Instance<typeof ChainStoreModel>
export interface ChainStore extends ChainStoreType {}
type ChainStoreSnapshotType = SnapshotOut<typeof ChainStoreModel>
export interface ChainStoreSnapshot extends ChainStoreSnapshotType {}
