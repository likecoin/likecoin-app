import { NotificationStoreModel, NotificationStore } from "./notification-store"

test("can be created", () => {
  const instance: NotificationStore = NotificationStoreModel.create({})

  expect(instance).toBeTruthy()
})
