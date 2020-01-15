import { CreatorModel, Creator } from "./creator"

test("can be created", () => {
  const instance: Creator = CreatorModel.create({
    likerID: "testuser",
  })

  expect(instance).toBeTruthy()
})
