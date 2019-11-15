import { TransferStoreModel, TransferStore } from "./transfer-store"

test("can be created", () => {
  const instance: TransferStore = TransferStoreModel.create({})

  expect(instance).toBeTruthy()
})
