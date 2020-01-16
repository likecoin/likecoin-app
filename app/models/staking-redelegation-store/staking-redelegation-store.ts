import {
  Instance,
  SnapshotOut,
} from "mobx-state-tree"

import { TxStoreModel } from "../tx-store"

/**
 * Staking delegation store
 */
export const StakingRedelegationStoreModel = TxStoreModel
  .named("StakingRedelegationStore")
  .volatile(() => ({
    from: "",
  }))
  .actions(self => ({
    setFrom: (newFrom: string = "") => {
      self.from = newFrom
      self.errorMessage = ""
    },
  }))

type StakingRedelegationStoreType = Instance<typeof StakingRedelegationStoreModel>
export interface StakingRedelegationStore extends StakingRedelegationStoreType {}
type StakingRedelegationStoreSnapshotType = SnapshotOut<typeof StakingRedelegationStoreModel>
export interface StakingRedelegationStoreSnapshot extends StakingRedelegationStoreSnapshotType {}
