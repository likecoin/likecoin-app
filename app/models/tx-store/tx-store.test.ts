import { TxStoreModel, TxStore } from "./tx-store"

test("can be created", () => {
  const instance: TxStore = TxStoreModel.create({})

  expect(instance).toBeTruthy()
})
