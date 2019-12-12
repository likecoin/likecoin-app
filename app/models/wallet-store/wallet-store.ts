import { Buffer } from "buffer"
import { Instance, SnapshotOut, types, flow, getEnv } from "mobx-state-tree"
import BigNumber from "bignumber.js"

import { Environment } from "../environment"
import { BigNumberPrimitive } from "../number"
import { Validator, ValidatorModel } from "../validator"
import {
  CosmosDelegation,
  CosmosRewardsResult,
  CosmosSignature,
  CosmosValidator,
  CosmosValidatorReward,
  CosmosUnbondingDelegation,
} from "../../services/cosmos"
import { extractCoinFromCosmosCoinList } from "../../services/cosmos/cosmos.utils"

/**
 * Parse Cosemos Validator to model
 *
 * @param validator The Validator result from Cosmos API
 */
function parseRawValidators(validator: CosmosValidator, env: Environment): Validator {
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
  } = validator
  return ValidatorModel.create({
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
}

function compareValidatorsInStaking(a: Validator, b: Validator) {
  if (a.isDelegated && !b.isDelegated) return -1
  if (!a.isDelegated && b.isDelegated) return 1
  if (a.delegatorRewards.isGreaterThan(b.delegatorRewards)) return -1
  if (a.delegatorRewards.isLessThan(b.delegatorRewards)) return 1
  return a.moniker.localeCompare(b.moniker)
}

/**
 * Wallet related store
 */
export const WalletStoreModel = types
  .model("WalletStore")
  .props({
    // Chain-wide
    annualProvision: types.optional(BigNumberPrimitive, "0"),
    validators: types.optional(types.map(types.late(() => ValidatorModel)), {}),
    validatorList: types.optional(types.array(types.reference(types.late(() => ValidatorModel))), []),

    /**
     * The address of the wallet
     */
    address: types.optional(types.string, ""),
    availableBalance: types.optional(BigNumberPrimitive, "0"),
    rewardsBalance: types.optional(BigNumberPrimitive, "0"),
  })
  .volatile(self => ({
    // Chain-wide
    denom: "LIKE",
    fractionDenom: "nanolike",
    fractionDigits: 9,
    gasPrice: new BigNumber(0),

    isFetchingBalance: false,
    hasFetchedBalance: false,
    isFetchingValidators: false,
    isFetchingDelegation: false,
    isFetchingUnbondingDelegation: false,
  }))
  .views(self => ({
    toDenom(value: BigNumber) {
      return value.shiftedBy(-self.fractionDigits)
    },
    /**
     * The URL of the account page in block explorer
     */
    get blockExplorerURL() {
      const env: Environment = getEnv(self)
      return env.bigDipper.getAccountURL(self.address)
    },
    get hasRewards() {
      return self.rewardsBalance.isGreaterThan(0)
    },
    get delegatedBalance() {
      return self.validatorList.reduce(
        (total, v) => total.plus(v.delegatorShare),
        new BigNumber(0)
      )
    },
    get totalDelegatorSharesFromAllValidators() {
      return self.validatorList.reduce(
        (total, v) => total.plus(v.totalDelegatorShares),
        new BigNumber(0)
      )
    },
    get isLoading() {
      return (
        self.isFetchingBalance ||
        self.isFetchingValidators ||
        self.isFetchingDelegation ||
        self.isFetchingUnbondingDelegation
      )
    },
    get sortedValidatorList() {
      return self.validatorList.sort(compareValidatorsInStaking)
    },
    get validatorListWithRewards() {
      return self.validatorList
        .filter(v => v.hasRewards)
        .map(v => v.operatorAddress)
    },
    get signer() {
      const env: Environment = getEnv(self)
      return async (message: string) => {
        const signedPayload = await env.authCoreAPI.cosmosSign(
          JSON.parse(message),
          self.address,
        )
        const {
          signature,
          pub_key: publicKey,
        } = signedPayload.signatures[signedPayload.signatures.length - 1]
        return {
          signature: Buffer.from(signature, 'base64'),
          publicKey: Buffer.from(publicKey.value, 'base64'),
        } as CosmosSignature
      }
    }
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
  }))
  .views(self => ({
    get formattedAvailableBalance() {
      return self.formatDenom(self.availableBalance, 4)
    },
    get formattedRewardsBalance() {
      return (self.hasRewards ? "+" : "").concat(self.formatDenom(self.rewardsBalance, 4, false))
    },
    get formattedTotalBalance() {
      return self.formatDenom(self.availableBalance
        .plus(self.delegatedBalance)
        .plus(self.rewardsBalance),
      4
      )
    },
  }))
  .actions(self => {
    const env: Environment = getEnv(self)

    const setValidatorRewards = ({ validator_address: id, reward }: CosmosValidatorReward) => {
      self.validators.get(id).setDelegatorRewards(extractCoinFromCosmosCoinList(reward, self.fractionDenom))
    }

    const setValidatorDelegation = ({ validator_address: id, shares }: CosmosDelegation) => {
      self.validators.get(id).setDelegatorShare(shares)
    }

    const setValidatorUnbondingDelegation = ({ validator_address: id, entries }: CosmosUnbondingDelegation) => {
      self.validators.get(id).setDelegatorUnbondingShare(entries)
    }

    return {
      setAddress(address: string) {
        self.address = address
      },
      fetchBalance: flow(function * () {
        self.isFetchingBalance = true
        try {
          self.availableBalance = new BigNumber(yield env.cosmosAPI.queryBalance(self.address, self.fractionDenom))
        } catch (error) {
          __DEV__ && console.tron.error(`Error occurs in WalletStore.fetchBalance: ${error}`, null)
        } finally {
          self.isFetchingBalance = false
          self.hasFetchedBalance = true
        }
      }),
      fetchRewards: flow(function * () {
        try {
          const result: CosmosRewardsResult = yield env.cosmosAPI.queryRewards(self.address)
          if (result.rewards) result.rewards.forEach(setValidatorRewards)
          self.rewardsBalance = new BigNumber(extractCoinFromCosmosCoinList(result.total, self.fractionDenom))
        } catch (error) {
          __DEV__ && console.tron.error(`Error occurs in WalletStore.fetchRewards: ${error}`, null)
        }
      }),
      fetchDelegations: flow(function * () {
        self.isFetchingDelegation = true
        try {
          const rawDelegations: CosmosDelegation[] = yield env.cosmosAPI.getDelegations(self.address)
          rawDelegations.forEach(setValidatorDelegation)
        } catch (error) {
          __DEV__ && console.tron.error(`Error occurs in WalletStore.fetchDelegations: ${error}`, null)
        } finally {
          self.isFetchingDelegation = false
        }
      }),
      fetchUnbondingDelegations: flow(function * () {
        self.isFetchingUnbondingDelegation = true
        try {
          const results: CosmosUnbondingDelegation[] = yield env.cosmosAPI.getUnbondingDelegations(self.address)
          results.forEach(setValidatorUnbondingDelegation)
        } catch (error) {
          __DEV__ && console.tron.error(`Error occurs in WalletStore.fetchUnbondingDelegations: ${error}`, null)
        } finally {
          self.isFetchingUnbondingDelegation = false
        }
      }),
      fetchAnnualProvision: flow(function * () {
        try {
          self.annualProvision = new BigNumber(yield env.cosmosAPI.queryAnnualProvision())
        } catch (error) {
          __DEV__ && console.tron.error(`Error occurs in WalletStore.fetchAnnualProvision: ${error}`, null)
        }
      }),
    }
  })
  .actions(self => ({
    fetchValidators: flow(function * () {
      const env: Environment = getEnv(self)
      self.isFetchingValidators = true
      try {
        const rawValidators: CosmosValidator[] = yield env.cosmosAPI.getValidators()
        const newValidatorList = []
        rawValidators.forEach((rawValidator) => {
          const updatedValidator = parseRawValidators(rawValidator, env)
          let validator = self.validators.get(updatedValidator.operatorAddress)
          if (!validator) {
            self.validators.put(updatedValidator)
            validator = updatedValidator
          }
          validator.update(updatedValidator)
          validator.fetchAvatarURL()
          newValidatorList.push(validator)
        })
        self.validatorList.replace(newValidatorList)
        self.fetchRewards()
        self.fetchDelegations()
        self.fetchUnbondingDelegations()
      } catch (error) {
        __DEV__ && console.tron.error(`Error occurs in WalletStore.fetchValidators: ${error}`, null)
      } finally {
        self.isFetchingValidators = false
      }
    }),
  }))

type WalletStoreType = Instance<typeof WalletStoreModel>
export interface WalletStore extends WalletStoreType {}
type WalletStoreSnapshotType = SnapshotOut<typeof WalletStoreModel>
export interface WalletStoreSnapshot extends WalletStoreSnapshotType {}
