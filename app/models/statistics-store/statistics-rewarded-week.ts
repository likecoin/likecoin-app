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
      let likeAmount = 0
      self.contents.forEach(content => {
        likeAmount += content.likeAmount
      })
      return likeAmount
    },
    get likeAmountFromCivicLikers() {
      let likeAmount = 0
      self.contents.forEach(content => {
        likeAmount += content.civicLikeAmount
      })
      return likeAmount
    },
    get likeAmountFromCreatorsFund() {
      let likeAmount = 0
      self.contents.forEach(content => {
        likeAmount += content.basicLikeAmount
      })
      return likeAmount
    },
    get likesCount() {
      let count = 0
      self.contents.forEach(content => {
        count += content.likesCount
      })
      return count
    },
    get basicLikersCount() {
      let count = 0
      self.contents.forEach(content => {
        count += content.basicLikersCount
      })
      return count
    },
    get civicLikersCount() {
      let count = 0
      self.contents.forEach(content => {
        count += content.civicLikersCount
      })
      return count
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
