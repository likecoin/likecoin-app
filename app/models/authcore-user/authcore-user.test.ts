import { AuthCoreUserModel, AuthCoreUser } from "./authcore-user"

test("can be created", () => {
  const instance: AuthCoreUser = AuthCoreUserModel.create({
    id: "1",
  })

  expect(instance).toBeTruthy()
})
