import { SupporterModel, Supporter } from "./supporter"

test("can be created", () => {
  const instance: Supporter = SupporterModel.create({
    likerID: "ckxpress",
    quantity: 1,
  })

  expect(instance).toBeTruthy()
})
