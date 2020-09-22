import { CreatorsStoreModel, CreatorsStore } from "./creators-store"

test("can be created", () => {
  const instance: CreatorsStore = CreatorsStoreModel.create({})

  expect(instance).toBeTruthy()
})