import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { withEnvironment } from "../extensions"
import { BigNumberPrimitive } from "../number"

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
  .extend(withEnvironment)
  .views(self => ({
    get avatar() {
      return self.avatorURL || `https://ui-avatars.com/api/?size=360&name=${encodeURIComponent(self.moniker)}&color=fff&background=aaa`
    },
    get blockExplorerURL() {
      return self.env.bigDipper.getValidatorURL(self.operatorAddress)
    },
  }))
  .actions(self => ({
    update(v: Validator) {
      self.operatorAddress = v.operatorAddress
      self.consensusPublicKey = v.consensusPublicKey
      self.isJailed = v.isJailed
      self.status = v.status
      self.tokens = v.tokens
      self.totalDelegatorShares = v.totalDelegatorShares

      self.moniker = v.moniker
      self.identity = v.identity
      self.website = v.website
      self.details = v.details

      if (v.avatorURL) {
        self.avatorURL = v.avatorURL
      }
      self.unbondingHeight = v.unbondingHeight
      self.unbondingTime = v.unbondingTime

      self.commissionRate = v.commissionRate
      self.maxCommissionRate = v.maxCommissionRate
      self.maxCommissionChangeRate = v.maxCommissionChangeRate
      self.commissionUpdateTime = v.commissionUpdateTime
      self.minSelfDelegation = v.minSelfDelegation
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

type ValidatorType = Instance<typeof ValidatorModel>
export interface Validator extends ValidatorType {}
type ValidatorSnapshotType = SnapshotOut<typeof ValidatorModel>
export interface ValidatorSnapshot extends ValidatorSnapshotType {}
