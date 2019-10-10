import { WalletStoreModel, WalletStore } from "./wallet-store"

test("can be created", () => {
  const instance: WalletStore = WalletStoreModel.create({})

  expect(instance).toBeTruthy()
})