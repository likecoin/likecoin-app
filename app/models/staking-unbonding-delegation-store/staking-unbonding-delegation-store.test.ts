import { StakingUnbondingDelegationStoreModel, StakingUnbondingDelegationStore } from "./staking-unbonding-delegation-store"

test("can be created", () => {
  const instance: StakingUnbondingDelegationStore = StakingUnbondingDelegationStoreModel.create({})

  expect(instance).toBeTruthy()
})
