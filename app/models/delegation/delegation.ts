import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { BigNumberPrimitive } from "../number"

export const DelegationModel = types
  .model("Delegation")
  .props({
    validatorAddress: types.identifier,
    shares: types.optional(BigNumberPrimitive, "0"),
    balance: types.optional(BigNumberPrimitive, "0"),
    rewards: types.optional(BigNumberPrimitive, "0"),
    unbonding: types.optional(BigNumberPrimitive, "0"),
  })
  .views(self => ({
    get hasDelegated() {
      return self.shares.isGreaterThan(0)
    },
    get hasRewards() {
      return self.rewards.isGreaterThan(0)
    },
  }))

type DelegationType = Instance<typeof DelegationModel>
export interface Delegation extends DelegationType {}
type DelegationSnapshotType = SnapshotOut<typeof DelegationModel>
export interface DelegationSnapshot extends DelegationSnapshotType {}
