import {
  StakingRewardsWithdrawStore,
  StakingRewardsWithdrawStoreModel
} from "./staking-rewards-withdraw-store"

test("can be created", () => {
  const instance: StakingRewardsWithdrawStore = StakingRewardsWithdrawStoreModel.create({})

  expect(instance).toBeTruthy()
})
