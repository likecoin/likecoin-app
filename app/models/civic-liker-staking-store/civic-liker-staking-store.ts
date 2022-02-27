import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { CivicLikerStakingInfoResult, CivicLikerStakingResult } from "../../services/api"

import { logError } from "../../utils/error"

import { withEnvironment } from "../extensions"

/**
 * Civic Liker Staking
 */
export const CivicLikerStakingStoreModel = types
  .model("CivicLikerStakingStore")
  .props({
    validatorAddress: types.optional(types.string, ""),
    stakingAmountTarget: types.optional(types.number, 0),
    stakingAmount: types.optional(types.number, 0),
    status: types.optional(types.string, "loading"),
  })
  .extend(withEnvironment)
  .views(self => ({
    get stakingAmountRequired() {
      return Math.min(100, Math.ceil(self.stakingAmountTarget) - Math.floor(self.stakingAmount))
    },
  }))
  .actions(self => ({
    fetchStakingInfo: flow(function * () {
      try {
        const response: CivicLikerStakingInfoResult = yield self.env.likerLandAPI.fetchCivicLikerStakingInfo()
        if (response.kind === "ok") {
          const {
            operatorAddress,
            stakingAmountTarget,
          } = response.data
          self.validatorAddress = operatorAddress
          self.stakingAmountTarget = stakingAmountTarget
        } 
      } catch (error) {
        logError(`Error occurs in CivicLikerStaking.fetchStakingInfo: ${error}`)
      }
    }),
    fetchStaking: flow(function * () {
      try {
        const response: CivicLikerStakingResult = yield self.env.likerLandAPI.fetchCivicLikerStaking()
        if (response.kind === "ok") {
          const {
            status,
            stakingAmount,
          } = response.data
          self.status = status
          self.stakingAmount = stakingAmount
        } 
      } catch (error) {
        logError(`Error occurs in CivicLikerStaking.fetchStaking: ${error}`)
      }
    }),
  }))
  .actions(self => ({
    fetch: flow(function * () {
      yield Promise.all([self.fetchStakingInfo(), self.fetchStaking()])
    }),
  }))

type CivicLikerStakingStoreType = Instance<typeof CivicLikerStakingStoreModel>
export interface CivicLikerStakingStore extends CivicLikerStakingStoreType {}
type CivicLikerStakingStoreSnapshotType = SnapshotOut<typeof CivicLikerStakingStoreModel>
export interface CivicLikerStakingStoreSnapshot extends CivicLikerStakingStoreSnapshotType {}
