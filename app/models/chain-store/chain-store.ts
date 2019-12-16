import { Instance, SnapshotOut, types, flow, getEnv } from "mobx-state-tree"
import BigNumber from "bignumber.js"

import { Environment } from "../environment"
import { BigNumberPrimitive } from "../number"
import { ValidatorModel, Validator } from "../validator"
import { WalletModel } from "../wallet"
import {
  CosmosDelegation,
  CosmosRewardsResult,
  CosmosUnbondingDelegation,
  CosmosValidator,
  CosmosValidatorReward,
} from "../../services/cosmos"
import { extractCoinFromCosmosCoinList } from "../../services/cosmos/cosmos.utils"

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
    selectedWallet: types.maybe(types.reference(WalletModel)),
  })
  .volatile(() => ({
    isFetchingValidators: false,
    isFetchingBalance: false,
    isFetchingDelegation: false,
    isFetchingUnbondingDelegation: false,
    isFetchingRewards: false,
  }))
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
      return self.selectedWallet
    },
    get validatorList() {
      return [...self.validators.values()]
    },
    get isLoading() {
      return self.isFetchingValidators ||
        self.isFetchingBalance ||
        self.isFetchingDelegation ||
        self.isFetchingUnbondingDelegation ||
        self.isFetchingRewards
    },
  }))
  .views(self => ({
    formatDenom(
      value: BigNumber,
      decimalPlaces?: number,
      showUnit: boolean = true,
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
    compareValidatorsByDelegation(a: Validator, b: Validator) {
      const aDelegation = self.wallet.delegations.get(a.operatorAddress)
      const bDelegation = self.wallet.delegations.get(b.operatorAddress)
      if (aDelegation) {
        if (!bDelegation) return -1
        if (aDelegation.hasDelegated && !bDelegation.hasDelegated) return -1
        if (!aDelegation.hasDelegated && aDelegation.hasDelegated) return 1
        if (aDelegation.rewards.isGreaterThan(bDelegation.rewards)) return -1
        if (aDelegation.rewards.isLessThan(bDelegation.rewards)) return 1
      } else {
        return 1
      }
      return a.moniker.localeCompare(b.moniker)
    },
  }))
  .views(self => ({
    get sortedValidatorList() {
      return self.validatorList.sort(self.compareValidatorsByDelegation)
    },
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
    calculateExpectedRewards(validator: Validator, delegatedTokens: BigNumber) {
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
    getValidatorExpectedReturnsPercentage(validator: Validator) {
      const delegatedTokens = new BigNumber(1e10)
      return self.formatPercent(
        self.calculateExpectedRewards(validator, delegatedTokens)
          .div(delegatedTokens)
      )
    },
  }))
  .actions(self => {
    const env: Environment = getEnv(self)
    return {
      setupWallet(address: string) {
        let wallet = self.wallets.get(address)
        if (!wallet) {
          wallet = WalletModel.create({ address })
          self.wallets.put(wallet)
          self.selectedWallet = wallet
        }
      },
      fetchAnnualProvision: flow(function * () {
        try {
          self.annualProvision = new BigNumber(yield env.cosmosAPI.queryAnnualProvision())
        } catch (error) {
          logError(`Error occurs in ChainStore.fetchAnnualProvision: ${error}`)
        }
      }),
      fetchValidators: flow(function * () {
        self.isFetchingValidators = true
        try {
          const rawValidators: CosmosValidator[] = yield env.cosmosAPI.getValidators()
          rawValidators.forEach((rawValidator) => {
            const {
              operator_address: operatorAddress,
              consensus_pubkey: consensusPublicKey,
              delegator_shares: totalDelegatorShares,
              jailed: isJailed,
              description,
              unbonding_height: unbondingHeight,
              unbonding_time: unbondingTime,
              commission: {
                commission_rates: {
                  rate: commissionRate,
                  max_rate: maxCommissionRate,
                  max_change_rate: maxCommissionChangeRate,
                },
                update_time: commissionUpdateTime,
              },
              min_self_delegation: minSelfDelegation,
              ...rest
            } = rawValidator
            const updatedValidator = ValidatorModel.create({
              operatorAddress,
              consensusPublicKey,
              totalDelegatorShares,
              isJailed,
              ...description,
              unbondingHeight,
              unbondingTime,
              commissionRate,
              maxCommissionRate,
              maxCommissionChangeRate,
              commissionUpdateTime,
              minSelfDelegation,
              ...rest
            }, env)
            let validator = self.validators.get(updatedValidator.operatorAddress)
            if (!validator) {
              self.validators.put(updatedValidator)
              validator = updatedValidator
            }
            validator.update(updatedValidator)
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
          self.wallet.availableBalance = new BigNumber(yield env.cosmosAPI.queryBalance(self.wallet.address, self.fractionDenom))
        } catch (error) {
          logError(`Error occurs in ChainStore.fetchBalance: ${error}`)
        } finally {
          self.isFetchingBalance = false
        }
      }),
      fetchDelegations: flow(function * () {
        self.isFetchingDelegation = true
        try {
          const rawDelegations: CosmosDelegation[] = yield env.cosmosAPI.getDelegations(self.wallet.address)
          rawDelegations.forEach(({ validator_address: id, shares }: CosmosDelegation) => {
            self.wallet.getDelegation(id, false).shares = new BigNumber(shares)
          })
        } catch (error) {
          logError(`Error occurs in ChainStore.fetchDelegations: ${error}`)
        } finally {
          self.isFetchingDelegation = false
        }
      }),
      fetchUnbondingDelegations: flow(function * () {
        self.isFetchingUnbondingDelegation = true
        try {
          const results: CosmosUnbondingDelegation[] = yield env.cosmosAPI.getUnbondingDelegations(self.wallet.address)
          results.forEach(({ validator_address: id, entries }: CosmosUnbondingDelegation) => {
            self.wallet.getDelegation(id, false).unbonding = entries.reduce(
              (total, { balance }) => new BigNumber(balance).plus(total),
              new BigNumber(0)
            )
          })
        } catch (error) {
          logError(`Error occurs in ChainStore.fetchUnbondingDelegations: ${error}`)
        } finally {
          self.isFetchingUnbondingDelegation = false
        }
      }),
      fetchRewards: flow(function * () {
        self.isFetchingRewards = true
        try {
          const result: CosmosRewardsResult = yield env.cosmosAPI.queryRewards(self.wallet.address)
          if (result.rewards) {
            result.rewards.forEach(({ validator_address: id, reward }: CosmosValidatorReward) => {
              self.wallet.getDelegation(id, false).rewards = new BigNumber(extractCoinFromCosmosCoinList(reward, self.fractionDenom))
            })
          }
        } catch (error) {
          logError(`Error occurs in ChainStore.fetchRewards: ${error}`)
        } finally {
          self.isFetchingRewards = false
        }
      }),
    }
  })

type ChainStoreType = Instance<typeof ChainStoreModel>
export interface ChainStore extends ChainStoreType {}
type ChainStoreSnapshotType = SnapshotOut<typeof ChainStoreModel>
export interface ChainStoreSnapshot extends ChainStoreSnapshotType {}
