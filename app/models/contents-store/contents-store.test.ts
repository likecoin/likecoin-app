import { ContentsStoreModel, ContentsStore } from "./contents-store"

test("can be created", () => {
  const instance: ContentsStore = ContentsStoreModel.create({})

  expect(instance).toBeTruthy()
})
