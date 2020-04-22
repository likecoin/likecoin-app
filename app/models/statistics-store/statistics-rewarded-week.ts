import {
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { StatisticsWeekModel } from "./statistics-week"
import {
  StatisticsRewardedDay,
  StatisticsRewardedDayModel,
} from "./statistics-rewarded-day"
import {
  StatisticsRewardedContentModel,
  StatisticsRewardedContentPropsKey,
} from "./statistics-rewarded-content"

/**
 * Weekly model for rewarded statistics
 */
export const StatisticsRewardedWeekModel = StatisticsWeekModel
  .named("StatisticsRewardedWeek")
  .props({
    contents: types.map(StatisticsRewardedContentModel),
    days: types.array(StatisticsRewardedDayModel),
  })
  .views(self => ({
    calcSumOfContentProps(key: StatisticsRewardedContentPropsKey) {
      let sum = 0
      if (!(key === "id" || key === "info")) {
        self.contents.forEach(content => {
          sum += content[key]
        })
      }
      return sum
    },
  }))
  .views(self => ({
    get contentList() {
      return [...self.contents.values()].sort((contentA, contentB) => {
        if (contentA.likeAmount === contentB.likeAmount) {
          return 0
        } else if (contentA.likeAmount < contentB.likeAmount) {
          return 1
        }
        return -1
      })
    },
    get likeAmount() {
      return self.calcSumOfContentProps("likeAmount")
    },
    get likeAmountFromCivicLikers() {
      return self.calcSumOfContentProps("civicLikeAmount")
    },
    get likeAmountFromCreatorsFund() {
      return self.calcSumOfContentProps("basicLikeAmount")
    },
    get likesCount() {
      return self.calcSumOfContentProps("likesCount")
    },
    get basicLikersCount() {
      return self.calcSumOfContentProps("basicLikersCount")
    },
    get civicLikersCount() {
      return self.calcSumOfContentProps("civicLikersCount")
    },
  }))
  .actions(self => ({
    setDays(days: StatisticsRewardedDay[]) {
      self.days.replace(days)
    },
  }))

type StatisticsRewardedWeekType = Instance<typeof StatisticsRewardedWeekModel>
export interface StatisticsRewardedWeek extends StatisticsRewardedWeekType {}
type StatisticsRewardedWeekSnapshotType = SnapshotOut<typeof StatisticsRewardedWeekModel>
export interface StatisticsRewardedWeekSnapshot extends StatisticsRewardedWeekSnapshotType {}
