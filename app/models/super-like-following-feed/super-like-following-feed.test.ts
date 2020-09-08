import { SuperLikeFollowingFeedModel, SuperLikeFollowingFeed } from "./super-like-following-feed"

test("can be created", () => {
  const instance: SuperLikeFollowingFeed = SuperLikeFollowingFeedModel.create({
    start: 0,
    end: 0,
  })

  expect(instance).toBeTruthy()
})
