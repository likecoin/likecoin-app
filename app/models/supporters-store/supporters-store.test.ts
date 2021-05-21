import { SupportersStoreModel, SupportersStore } from "./supporters-store"

test("can be created", () => {
  const instance: SupportersStore = SupportersStoreModel.create({})

  expect(instance).toBeTruthy()
})