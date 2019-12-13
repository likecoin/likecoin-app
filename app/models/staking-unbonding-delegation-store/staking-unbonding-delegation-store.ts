import {
  flow,
  getEnv,
  Instance,
  SnapshotOut,
} from "mobx-state-tree"

import { createTxStore } from "../tx-store"
import { Environment } from "../environment"

/**
 * Staking unbonding delegation store
 */
export const StakingUnbondingDelegationStoreModel = createTxStore("StakingUnbondingDelegationStore")
  .actions(self => ({
    createUnbondingDelegateTx: flow(function * (fromAddress: string) {
      const env: Environment = getEnv(self)
      yield self.createTx(env.cosmosAPI.createUnbondingDelegateMessage(
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
