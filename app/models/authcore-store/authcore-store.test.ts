import { AuthCoreStoreModel, AuthcoreStore } from "./authcore-store"

test("can be created", () => {
  const instance: AuthcoreStore = AuthCoreStoreModel.create({})

  expect(instance).toBeTruthy()
})
