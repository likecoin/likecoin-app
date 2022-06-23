import { MySuperLikeFeedStoreModel, MySuperLikeFeedStore } from "./my-super-likes-store"

test("can be created", () => {
  const instance: MySuperLikeFeedStore = MySuperLikeFeedStoreModel.create({})

  expect(instance).toBeTruthy()
})
