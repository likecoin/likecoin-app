import { observable } from "mobx"
import { Instance, SnapshotOut, types, flow, getEnv } from "mobx-state-tree"

import { Environment } from "../environment"
import { ValidatorModel } from "../validator"
import { nanolikeToLIKE } from "../../utils/number"
import { CosmosValidator } from "../../services/cosmos"

/**
 * Parse Cosemos Validator to model
 * 
 * @param validator The Validator result from Cosmos API
 */
function parseRawValidators(validator: CosmosValidator) {
  const {
    operator_address: operatorAddress,
    consensus_pubkey: consensusPubkey,
    delegator_shares: delegatorShares,
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
    delegatorShares,
    ...description,
    unbondingHeight,
    unbondingTime,
    commissionRate,
    maxCommissionRate,
    maxCommissionChangeRate,
    commissionUpdateTime,
    minSelfDelegation,
    ...rest
  })
}

/**
 * Wallet related store
 */
export const WalletStoreModel = types
  .model("WalletStore")
  .props({
    validators: types.optional(types.map(ValidatorModel), {}),
    validatorList: types.optional(types.array(types.reference(ValidatorModel)), [])
  })
  .extend(self => {
    const env: Environment = getEnv(self)

    const balance = observable.box("0")
    const isFetchingBalance = observable.box(false)
    const hasFetchedBalance = observable.box(false)

    const fetchBalance = flow(function * (address: string) {
      isFetchingBalance.set(true)
      try {
        balance.set(yield env.cosmosAPI.queryBalance(address))
      } catch (error) {
        __DEV__ && console.tron.error(`Error occurs in WalletStore.fetchBalance: ${error}`, null)
      } finally {
        isFetchingBalance.set(false)
        hasFetchedBalance.set(true)
      }
    })

    const fetchValidators = flow(function * () {
      try {
        const rawValidators: CosmosValidator[] = yield env.cosmosAPI.getValidators()
        self.validatorList.replace([])
        rawValidators.forEach((rawValidator) => {
          const validator = parseRawValidators(rawValidator)
          self.validators.put(validator)
          validator.fetchAvatarURL()
          self.validatorList.push(validator)
        })
      } catch (error) {
        __DEV__ && console.tron.error(`Error occurs in WalletStore.fetchValidators: ${error}`, null)
      }
    })

    return {
      views: {
        get formattedBalance() {
          return nanolikeToLIKE(balance.get())
        },
        get isFetchingBalance() {
          return isFetchingBalance.get()
        },
        get hasFetchedBalance() {
          return hasFetchedBalance.get()
        },
      },
      actions: {
        fetchValidators,
        fetchBalance,
      }
    }
  })
 
type WalletStoreType = Instance<typeof WalletStoreModel>
export interface WalletStore extends WalletStoreType {}
type WalletStoreSnapshotType = SnapshotOut<typeof WalletStoreModel>
export interface WalletStoreSnapshot extends WalletStoreSnapshotType {}
