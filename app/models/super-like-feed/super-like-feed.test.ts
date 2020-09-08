import { SuperLikeFeedModel, SuperLikeFeed } from "./super-like-feed"

test("can be created", () => {
  const instance: SuperLikeFeed = SuperLikeFeedModel.create({})

  expect(instance).toBeTruthy()
})