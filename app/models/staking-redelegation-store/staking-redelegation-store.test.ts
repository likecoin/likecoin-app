import { StakingRedelegationStoreModel, StakingRedelegationStore } from "./staking-redelegation-store"

test("can be created", () => {
  const instance: StakingRedelegationStore = StakingRedelegationStoreModel.create({})

  expect(instance).toBeTruthy()
})
