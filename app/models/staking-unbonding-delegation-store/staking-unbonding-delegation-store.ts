import {
  flow,
  Instance,
  SnapshotOut,
} from "mobx-state-tree"

import { TxStoreModel } from "../tx-store"

/**
 * Staking unbonding delegation store
 */
export const StakingUnbondingDelegationStoreModel = TxStoreModel
  .named("StakingUnbondingDelegationStore")
  .actions(self => ({
    createUnbondingDelegateTx: flow(function * (fromAddress: string) {
      yield self.createTx(self.env.cosmosAPI.createUnbondingDelegateMessage(
        fromAddress,
        self.target,
        self.amount.toFixed(),
        self.fractionDenom,
      ))
    }),
  }))

type StakingUnbondingDelegationStoreType = Instance<typeof StakingUnbondingDelegationStoreModel>
export interface StakingUnbondingDelegationStore extends StakingUnbondingDelegationStoreType {}
type StakingUnbondingDelegationStoreSnapshotType = SnapshotOut<typeof StakingUnbondingDelegationStoreModel>
export interface StakingUnbondingDelegationStoreSnapshot extends StakingUnbondingDelegationStoreSnapshotType {}
