import {
  SuperLikeGlobalStoreModel,
  SuperLikeGlobalStore,
} from "./super-like-global-store"

test("can be created", () => {
  const instance: SuperLikeGlobalStore = SuperLikeGlobalStoreModel.create({})

  expect(instance).toBeTruthy()
})
