import { WalletModel, Wallet } from "./wallet"

test("can be created", () => {
  const instance: Wallet = WalletModel.create({
    address: "cosmos100000000000000000000000000000000000000",
  })

  expect(instance).toBeTruthy()
})
