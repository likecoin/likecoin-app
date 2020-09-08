import { NotificationModel, Notification } from "./notification"

test("can be created", () => {
  const instance: Notification = NotificationModel.create({
    id: "1",
    type: "transfer",
    timestamp: 0,
  })

  expect(instance).toBeTruthy()
})
