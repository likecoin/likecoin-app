import {
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import {
  StatisticsRewardedContent,
  StatisticsRewardedContentModel,
} from "./statistics-rewarded-content"

/**
 * Daily model for rewarded statistics
 */
export const StatisticsRewardedDayModel = types
  .model("StatisticsRewardedDay")
  .props({
    contents: types.array(StatisticsRewardedContentModel),
  })
  .views(self => ({
    get totalBasicLikeAmount() {
      return self.contents.reduce(
        (amount, content) => amount + content.basicLikeAmount, 0)
    },
    get totalCivicLikeAmount() {
      return self.contents.reduce(
        (amount, content) => amount + content.civicLikeAmount, 0)
    },
    get totalLikeAmount() {
      return self.contents.reduce(
        (amount, content) => amount + content.likeAmount, 0)
    },
  }))
  .actions(self => ({
    setContents(contents: StatisticsRewardedContent[]) {
      self.contents.replace(contents)
    },
  }))

type StatisticsRewardedDayType = Instance<typeof StatisticsRewardedDayModel>
export interface StatisticsRewardedDay extends StatisticsRewardedDayType {}
type StatisticsRewardedDaySnapshotType = SnapshotOut<typeof StatisticsRewardedDayModel>
export interface StatisticsRewardedDaySnapshot extends StatisticsRewardedDaySnapshotType {}
