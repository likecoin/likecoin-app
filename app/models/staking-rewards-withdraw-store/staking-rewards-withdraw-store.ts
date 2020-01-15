import {
  flow,
  Instance,
  SnapshotOut,
} from "mobx-state-tree"
import BigNumber from "bignumber.js"

import { createTxStore } from "../tx-store"

/**
 * Staking rewards withdraw store
 */
export const StakingRewardsWithdrawStoreModel = createTxStore("StakingRewardsWithdrawStore")
  .volatile(() => ({
    rewardsBalance: new BigNumber(0),
  }))
  .views(self => ({
    get canWithdraw() {
      return self.rewardsBalance.shiftedBy(-self.fractionDigits).isGreaterThanOrEqualTo(1)
    },
  }))
  .actions(self => ({
    createRewardsWithdrawTx: flow(function * (
      fromAddress: string,
      validatorAddresses: string[],
      rewardsBalance: BigNumber,
    ) {
      self.rewardsBalance = rewardsBalance
      if (self.canWithdraw) {
        yield self.createTx(self.env.cosmosAPI.createRewardsWithdrawMessage(
          fromAddress,
          validatorAddresses
        ))
      } else {
        self.setError(new Error("REWARDS_WITHDRAW_BELOW_MIN"))
      }
    }),
  }))

type StakingRewardsWithdrawStoreType = Instance<typeof StakingRewardsWithdrawStoreModel>
export interface StakingRewardsWithdrawStore extends StakingRewardsWithdrawStoreType {}
type StakingRewardsWithdrawStoreSnapshotType = SnapshotOut<typeof StakingRewardsWithdrawStoreModel>
export interface StakingRewardsWithdrawStoreSnapshot extends StakingRewardsWithdrawStoreSnapshotType {}
