import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import BigNumber from "bignumber.js"

import { withEnvironment } from "../extensions"
import { BigNumberPrimitive } from "../number"
import { CosmosValidator as ValidatorResult } from "../../services/cosmos"
import { logError } from "../../utils/error"

export function parseValidatorResult(result: ValidatorResult) {
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
  } = result
  return {
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
  }
}

/**
 * A Cosmos validator.
 */
export const ValidatorModel = types
  .model("Validator")
  .props({
    operatorAddress: types.identifier,
    consensusPublicKey: types.string,
    isJailed: types.boolean,
    status: types.number,
    tokens: types.optional(BigNumberPrimitive, "0"),
    totalDelegatorShares: types.optional(BigNumberPrimitive, "0"),

    // Description
    moniker: types.string,
    identity: types.string,
    website: types.string,
    details: types.string,
    avatorURL: types.maybe(types.string),

    unbondingHeight: types.string,
    unbondingTime: types.string,

    // Commission
    commissionRate: types.string,
    maxCommissionRate: types.optional(BigNumberPrimitive, "0"),
    maxCommissionChangeRate: types.string,
    commissionUpdateTime: types.string,

    minSelfDelegation: types.string,
  })
  .volatile(() => ({
    isFetchingInfo: false,
    isFetchingDelegation: false,
    isFetchingRewards: false,
    isFetchingUnbondingDelegation: false,
  }))
  .extend(withEnvironment)
  .views(self => ({
    get avatar() {
      return self.avatorURL || `https://ui-avatars.com/api/?size=360&name=${encodeURIComponent(self.moniker)}&color=fff&background=aaa`
    },
    get blockExplorerURL() {
      return self.env.bigDipper.getValidatorURL(self.operatorAddress)
    },
    get isLoading() {
      return (
        self.isFetchingInfo ||
        self.isFetchingDelegation ||
        self.isFetchingRewards ||
        self.isFetchingUnbondingDelegation
      )
    },
    get isActive() {
      return !self.isJailed && self.status === 2
    },
  }))
  .actions(self => ({
    update(result: ValidatorResult) {
      const parsed = parseValidatorResult(result)
      self.operatorAddress = parsed.operatorAddress
      self.consensusPublicKey = parsed.consensusPublicKey
      self.isJailed = parsed.isJailed
      self.status = parsed.status
      self.tokens = new BigNumber(parsed.tokens)
      self.totalDelegatorShares = new BigNumber(parsed.totalDelegatorShares)

      self.moniker = parsed.moniker
      self.identity = parsed.identity
      self.website = parsed.website
      self.details = parsed.details

      self.unbondingHeight = parsed.unbondingHeight
      self.unbondingTime = parsed.unbondingTime

      self.commissionRate = parsed.commissionRate
      self.maxCommissionRate = new BigNumber(parsed.maxCommissionRate)
      self.maxCommissionChangeRate = parsed.maxCommissionChangeRate
      self.commissionUpdateTime = parsed.commissionUpdateTime
      self.minSelfDelegation = parsed.minSelfDelegation
    },
    fetchAvatarURL: flow(function * () {
      if (self.identity.length === 16) {
        const response: Response = yield fetch(`https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${self.identity}&fields=pictures`, {
          method: 'GET',
        })
        if (response.status === 200) {
          const { them }: any = yield response.json()
          const url = them && them.length && them[0].pictures && them[0].pictures.primary && them[0].pictures.primary.url
          if (/^https?:\/\//.test(url)) {
            self.avatorURL = url
          }
        }
      }
    }),
  }))
  .actions(self => ({
    fetchInfo: flow(function * () {
      try {
        self.isFetchingInfo = true
        const rawValidator: ValidatorResult = yield self.env.cosmosAPI.queryValidator(self.operatorAddress)
        self.update(rawValidator)
      } catch (error) {
        logError(`Error occurs in Validator.fetchInfo: ${error}`)
      } finally {
        self.isFetchingInfo = false
      }
    }),
  }))

type ValidatorType = Instance<typeof ValidatorModel>
export interface Validator extends ValidatorType {}
type ValidatorSnapshotType = SnapshotOut<typeof ValidatorModel>
export interface ValidatorSnapshot extends ValidatorSnapshotType {}
