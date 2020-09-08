import {
  SuperLikeDailyFeed,
  SuperLikeDailyFeedModel,
} from "./super-like-daily-feed"

test("can be created", () => {
  const instance: SuperLikeDailyFeed = SuperLikeDailyFeedModel.create({
    id: "2020-01-01T00:00:00+08:00",
  })

  expect(instance).toBeTruthy()
})
