import { Buffer } from "buffer"
import { observable } from "mobx"
import { Instance, SnapshotOut, types, flow, getEnv } from "mobx-state-tree"
import BigNumber from "bignumber.js"

import { Environment } from "../environment"
import { Validator, ValidatorModel } from "../validator"
import {
  compareNumber,
  formatLIKE,
  formatNumber,
  formatNumberWithSign,
} from "../../utils/number"
import {
  CosmosDelegation,
  CosmosRewardsResult,
  CosmosSignature,
  CosmosValidator,
  CosmosValidatorReward,
} from "../../services/cosmos"
import {
  convertNanolikeToLIKE,
  extractNanolikeFromCosmosCoinList,
} from "../../services/cosmos/cosmos.utils"

/**
 * Parse Cosemos Validator to model
 *
 * @param validator The Validator result from Cosmos API
 */
function parseRawValidators(validator: CosmosValidator, env: Environment) {
  const {
    operator_address: operatorAddress,
    consensus_pubkey: consensusPubkey,
    delegator_shares: totalDelegatorShares,
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
    consensusPubkey,
    totalDelegatorShares,
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

/**
 * Wallet related store
 */
export const WalletStoreModel = types
  .model("WalletStore")
  .props({
    annualProvision: types.optional(types.number, 0),
    validators: types.optional(types.map(ValidatorModel), {}),
    validatorList: types.optional(types.array(types.reference(ValidatorModel)), [])
  })
  .extend(self => {
    const env: Environment = getEnv(self)

    /**
     * The address of the wallet
     */
    const address = observable.box("")
    const availableBalance = observable.box("0")
    const rewardsBalance = observable.box("0")
    const isFetchingBalance = observable.box(false)
    const hasFetchedBalance = observable.box(false)

    const setAddress = (newAddress: string) => {
      address.set(newAddress)
    }

    const getAvailableBalanceInLIKE = () => {
      return convertNanolikeToLIKE(availableBalance.get())
    }

    function getRewardsBalance() {
      return convertNanolikeToLIKE(rewardsBalance.get())
    }

    const getAllTotalDelegatorShares = () => self.validatorList.reduce(
      (total, validator) => total + parseFloat(validator.totalDelegatorShares),
      0
    )

    const setValidatorRewards = ({ validator_address: id, reward }: CosmosValidatorReward) => {
      self.validators.get(id).setDelegatorRewards(extractNanolikeFromCosmosCoinList(reward))
    }

    function compareValidatorsInStaking(a: Validator, b: Validator) {
      if (a.isDelegated && !b.isDelegated) return -1
      if (!a.isDelegated && b.isDelegated) return 1
      const aRewards = new BigNumber(a.delegatorRewards)
      const bRewards = new BigNumber(b.delegatorRewards)
      if (aRewards.isGreaterThan(bRewards)) return -1
      if (aRewards.isLessThan(bRewards)) return 1
      return a.moniker.localeCompare(b.moniker)
    }

    const fetchRewards = flow(function * () {
      try {
        const result: CosmosRewardsResult = yield env.cosmosAPI.queryRewards(address.get())
        result.rewards.forEach(setValidatorRewards)
        rewardsBalance.set(extractNanolikeFromCosmosCoinList(result.total))
      } catch (error) {
        __DEV__ && console.tron.error(`Error occurs in WalletStore.fetchRewards: ${error}`, null)
      }
    })

    const fetchBalance = flow(function * () {
      isFetchingBalance.set(true)
      try {
        availableBalance.set(yield env.cosmosAPI.queryBalance(address.get()))
      } catch (error) {
        __DEV__ && console.tron.error(`Error occurs in WalletStore.fetchBalance: ${error}`, null)
      } finally {
        isFetchingBalance.set(false)
        hasFetchedBalance.set(true)
      }
    })

    const setValidatorDelegation = (rawDelegation: CosmosDelegation) => {
      self.validators.get(rawDelegation.validator_address).setDelegatorShare(rawDelegation.shares)
    }

    const fetchDelegations = flow(function * () {
      try {
        const rawDelegations: CosmosDelegation[] = yield env.cosmosAPI.getDelegations(address.get())
        rawDelegations.forEach(setValidatorDelegation)
      } catch (error) {
        __DEV__ && console.tron.error(`Error occurs in WalletStore.fetchDelegations: ${error}`, null)
      }
    })

    const fetchValidators = flow(function * () {
      try {
        const rawValidators: CosmosValidator[] = yield env.cosmosAPI.getValidators()
        self.validatorList.replace([])
        rawValidators.forEach((rawValidator) => {
          const validator = parseRawValidators(rawValidator, env)
          self.validators.put(validator)
          validator.fetchAvatarURL()
          self.validatorList.push(validator)
        })
        self.validatorList.forEach((validator) => {
          validator.setExpectedReturns(
            getAllTotalDelegatorShares(),
            self.annualProvision
          )
        })
        fetchDelegations()
        fetchRewards()
      } catch (error) {
        __DEV__ && console.tron.error(`Error occurs in WalletStore.fetchValidators: ${error}`, null)
      }
    })

    const fetchAnnualProvision = flow(function * () {
      try {
        self.annualProvision = yield env.cosmosAPI.queryAnnualProvision().then(parseFloat)
      } catch (error) {
        __DEV__ && console.tron.error(`Error occurs in WalletStore.fetchAnnualProvision: ${error}`, null)
      }
    })

    const createSigner = () => {
      return async (message: string) => {
        const signedPayload = await env.authCoreAPI.cosmosProvider.sign(
          JSON.parse(message),
          address.get(),
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

    return {
      views: {
        get address() {
          return address.get()
        },
        /**
         * The URL of the account page in block explorer
         */
        get blockExplorerURL() {
          return env.bigDipper.getAccountURL(address.get())
        },
        get totalDelegatorShares() {
          return getAllTotalDelegatorShares()
        },
        /**
         * Return balance in LIKE
         */
        get availableBalanceInLIKE() {
          return getAvailableBalanceInLIKE()
        },
        get formattedAvailableBalance() {
          return formatLIKE(formatNumber(getAvailableBalanceInLIKE(), 2))
        },
        get hasRewards() {
          return compareNumber(rewardsBalance.get()) > 0
        },
        get rewardsBalance() {
          return getRewardsBalance()
        },
        get formattedRewardsBalance() {
          return formatNumberWithSign(getRewardsBalance(), 2)
        },
        get formattedTotalBalance() {
          return formatNumber(
            convertNanolikeToLIKE(
              new BigNumber(availableBalance.get())
                .plus(new BigNumber(rewardsBalance.get()))
                .toFixed()
            ),
            2
          )
        },
        get isFetchingBalance() {
          return isFetchingBalance.get()
        },
        get hasFetchedBalance() {
          return hasFetchedBalance.get()
        },
        getValidatorVotingPower(address: string) {
          const validator = self.validators.get(address)
          if (!validator) {
            return 0
          }
          return Number.parseFloat(validator.totalDelegatorShares) / getAllTotalDelegatorShares() * 100
        },
        get signer() {
          return createSigner()
        },
        get sortedValidatorList() {
          return self.validatorList.sort(compareValidatorsInStaking)
        },
        get validatorListWithRewards() {
          return self.validatorList
            .filter(v => new BigNumber(v.delegatorRewards).isGreaterThan(0))
            .map(v => v.operatorAddress)
        },
      },
      actions: {
        fetchValidators,
        fetchBalance,
        fetchDelegations,
        fetchAnnualProvision,
        setAddress,
      }
    }
  })

type WalletStoreType = Instance<typeof WalletStoreModel>
export interface WalletStore extends WalletStoreType {}
type WalletStoreSnapshotType = SnapshotOut<typeof WalletStoreModel>
export interface WalletStoreSnapshot extends WalletStoreSnapshotType {}
