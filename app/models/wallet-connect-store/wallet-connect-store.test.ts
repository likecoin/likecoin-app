import { WalletConnectStoreModel, WalletConnectStore } from "./wallet-connect-store"

test("can be created", () => {
  const instance: WalletConnectStore = WalletConnectStoreModel.create({})

  expect(instance).toBeTruthy()
})