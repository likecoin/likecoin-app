import { CreatorsFollowStoreModel, CreatorsFollowStore } from "./creators-follow-store"

test("can be created", () => {
  const instance: CreatorsFollowStore = CreatorsFollowStoreModel.create({})

  expect(instance).toBeTruthy()
})