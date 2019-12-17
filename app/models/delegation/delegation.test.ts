import { Delegation, DelegationModel } from "./delegation"

test("can be created", () => {
  const instance: Delegation = DelegationModel.create({
    validatorAddress: "cosmosvaloper100000000000000000000000000000000000000",
  })

  expect(instance).toBeTruthy()
})
