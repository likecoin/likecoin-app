import {
  flow,
  Instance,
  SnapshotOut,
} from "mobx-state-tree"
import BigNumber from "bignumber.js"

import { TxStoreModel, TxInsufficientGasFeeError } from "../tx-store"

/**
 * Staking rewards withdraw store
 */
export const StakingRewardsWithdrawStoreModel = TxStoreModel
  .named("StakingRewardsWithdrawStore")
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
      availableBalance: BigNumber,
    ) {
      self.rewardsBalance = rewardsBalance
      if (self.canWithdraw) {
        yield self.createTx(self.env.cosmosAPI.createRewardsWithdrawMessage(
          fromAddress,
          validatorAddresses
        ))
        if (self.fee.isGreaterThan(availableBalance)) {
          const diff = self.fee.minus(availableBalance).shiftedBy(-self.fractionDigits).toFixed()
          self.setError(new TxInsufficientGasFeeError(diff));
        }
      } else {
        self.setError(new Error("REWARDS_WITHDRAW_BELOW_MIN"))
      }
    }),
  }))

type StakingRewardsWithdrawStoreType = Instance<typeof StakingRewardsWithdrawStoreModel>
export interface StakingRewardsWithdrawStore extends StakingRewardsWithdrawStoreType {}
type StakingRewardsWithdrawStoreSnapshotType = SnapshotOut<typeof StakingRewardsWithdrawStoreModel>
export interface StakingRewardsWithdrawStoreSnapshot extends StakingRewardsWithdrawStoreSnapshotType {}
