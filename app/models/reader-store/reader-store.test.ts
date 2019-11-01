import { ReaderStoreModel, ReaderStore } from "./reader-store"

test("can be created", () => {
  const instance: ReaderStore = ReaderStoreModel.create({})

  expect(instance).toBeTruthy()
})
