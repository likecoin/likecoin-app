import { SuperLikeFeedModel, SuperLikeFeed } from "./super-like-feed"

test("can be created", () => {
  const instance: SuperLikeFeed = SuperLikeFeedModel.create({
    start: 0,
    end: 0,
  })

  expect(instance).toBeTruthy()
})
