import { IntroContentModel, IntroContent } from "./intro-content"

test("can be created", () => {
  const instance: IntroContent = IntroContentModel.create({})

  expect(instance).toBeTruthy()
})
