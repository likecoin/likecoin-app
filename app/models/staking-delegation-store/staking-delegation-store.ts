import {
  flow,
  Instance,
  SnapshotOut,
} from "mobx-state-tree"

import { createTxStore } from "../tx-store"

/**
 * Staking delegation store
 */
export const StakingDelegationStoreModel = createTxStore("StakingDelegationStore")
  .actions(self => ({
    createDelegateTx: flow(function * (fromAddress: string) {
      yield self.createTx(self.env.cosmosAPI.createDelegateMessage(
        fromAddress,
        self.target,
        self.amount.toFixed(),
        self.fractionDenom,
      ))
    }),
  }))

type StakingDelegationStoreType = Instance<typeof StakingDelegationStoreModel>
export interface StakingDelegationStore extends StakingDelegationStoreType {}
type StakingDelegationStoreSnapshotType = SnapshotOut<typeof StakingDelegationStoreModel>
export interface StakingDelegationStoreSnapshot extends StakingDelegationStoreSnapshotType {}
