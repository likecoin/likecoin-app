import { UserModel, User } from "./user"

test("can be created", () => {
  const instance: User = UserModel.create({
    likerID: "testuser",
  })

  expect(instance).toBeTruthy()
})
