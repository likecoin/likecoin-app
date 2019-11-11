import { Buffer } from "buffer"
import { observable } from "mobx"
import { Instance, SnapshotOut, types, flow, getEnv } from "mobx-state-tree"

import { Environment } from "../environment"
import { ValidatorModel } from "../validator"
import { formatNumber } from "../../utils/number"
import {
  CosmosSignature,
  CosmosValidator,
} from "../../services/cosmos"
import { convertNanolikeToLIKE } from "../../services/cosmos/cosmos.utils"

/**
 * Parse Cosemos Validator to model
 *
 * @param validator The Validator result from Cosmos API
 */
function parseRawValidators(validator: CosmosValidator, env: Environment) {
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
    const balance = observable.box("0")
    const isFetchingBalance = observable.box(false)
    const hasFetchedBalance = observable.box(false)

    const setAddress = (newAddress: string) => {
      address.set(newAddress)
    }

    const getBalanceInLIKE = () => {
      return convertNanolikeToLIKE(balance.get())
    }

    const getTotalDelegatorShares = () => self.validatorList.reduce(
      (total, validator) => total + parseFloat(validator.delegatorShares),
      0
    )

    const fetchBalance = flow(function * () {
      isFetchingBalance.set(true)
      try {
        balance.set(yield env.cosmosAPI.queryBalance(address.get()))
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
          const validator = parseRawValidators(rawValidator, env)
          self.validators.put(validator)
          validator.fetchAvatarURL()
          self.validatorList.push(validator)
        })
        self.validatorList.forEach((validator) => {
          validator.setExpectedReturns(
            getTotalDelegatorShares(),
            self.annualProvision
          )
        })
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
          return getTotalDelegatorShares()
        },
        /**
         * Return balance in LIKE
         */
        get balanceInLIKE() {
          return getBalanceInLIKE()
        },
        get formattedBalance() {
          return formatNumber(getBalanceInLIKE(), 2)
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
          return Number.parseFloat(validator.delegatorShares) / getTotalDelegatorShares() * 100
        },
        get signer() {
          return createSigner()
        },
      },
      actions: {
        fetchValidators,
        fetchBalance,
        fetchAnnualProvision,
        setAddress,
      }
    }
  })

type WalletStoreType = Instance<typeof WalletStoreModel>
export interface WalletStore extends WalletStoreType {}
type WalletStoreSnapshotType = SnapshotOut<typeof WalletStoreModel>
export interface WalletStoreSnapshot extends WalletStoreSnapshotType {}
