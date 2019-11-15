import { StakingDelegationStoreModel, StakingDelegationStore } from "./staking-delegation-store"

test("can be created", () => {
  const instance: StakingDelegationStore = StakingDelegationStoreModel.create({})

  expect(instance).toBeTruthy()
})
