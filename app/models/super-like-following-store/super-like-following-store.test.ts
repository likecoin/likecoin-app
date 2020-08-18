import { SuperLikeFollowingStoreModel, SuperLikeFollowingStore } from "./super-like-following-store"

test("can be created", () => {
  const instance: SuperLikeFollowingStore = SuperLikeFollowingStoreModel.create({})

  expect(instance).toBeTruthy()
})