import { DeepLinkHandleStoreModel, DeepLinkHandleStore } from "./deep-link-handle-store"

test("can be created", () => {
  const instance: DeepLinkHandleStore = DeepLinkHandleStoreModel.create({})

  expect(instance).toBeTruthy()
})