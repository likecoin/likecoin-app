import {
  flow,
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
    setFrom: (newFrom = "") => {
      self.from = newFrom
      self.errorMessage = ""
    },
    createRedelegateTx: flow(function * (senderAndress: string) {
      yield self.createTx(self.env.cosmosAPI.createRedelegateMessage(
        senderAndress,
        self.from,
        self.target,
        self.amount.toFixed(),
        self.fractionDenom,
      ))
    }),
  }))

type StakingRedelegationStoreType = Instance<typeof StakingRedelegationStoreModel>
export interface StakingRedelegationStore extends StakingRedelegationStoreType {}
type StakingRedelegationStoreSnapshotType = SnapshotOut<typeof StakingRedelegationStoreModel>
export interface StakingRedelegationStoreSnapshot extends StakingRedelegationStoreSnapshotType {}
