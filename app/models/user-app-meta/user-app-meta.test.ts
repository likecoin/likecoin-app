import { UserAppMetaModel, UserAppMeta } from "./user-app-meta"

test("can be created", () => {
  const instance: UserAppMeta = UserAppMetaModel.create({
    isNew: false,
  })

  expect(instance).toBeTruthy()
})
