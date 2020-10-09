import { UserAppMetaModel, UserAppMetaStore } from "./user-app-meta"

test("can be created", () => {
  const instance: UserAppMetaStore = UserAppMetaModel.create({
    isNew: false,
  })

  expect(instance).toBeTruthy()
})
