import {
  flow,
  Instance,
  SnapshotOut,
} from "mobx-state-tree"

import { createTxStore } from "../tx-store"

/**
 * Staking rewards withdraw store
 */
export const StakingRewardsWithdrawStoreModel = createTxStore("StakingRewardsWithdrawStore")
  .actions(self => ({
    createRewardsWithdrawTx: flow(function * (
      fromAddress: string,
      validatorAddresses: string[],
    ) {
      yield self.createTx(self.env.cosmosAPI.createRewardsWithdrawMessage(
        fromAddress,
        validatorAddresses
      ))
    }),
  }))

type StakingRewardsWithdrawStoreType = Instance<typeof StakingRewardsWithdrawStoreModel>
export interface StakingRewardsWithdrawStore extends StakingRewardsWithdrawStoreType {}
type StakingRewardsWithdrawStoreSnapshotType = SnapshotOut<typeof StakingRewardsWithdrawStoreModel>
export interface StakingRewardsWithdrawStoreSnapshot extends StakingRewardsWithdrawStoreSnapshotType {}
