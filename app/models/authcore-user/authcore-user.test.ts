import { AuthCoreUserModel, AuthCoreUser } from "./authcore-user"

test("can be created", () => {
  const instance: AuthCoreUser = AuthCoreUserModel.create({})

  expect(instance).toBeTruthy()
})
