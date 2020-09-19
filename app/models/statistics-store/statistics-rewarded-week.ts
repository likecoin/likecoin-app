import {
  flow,
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
  StatisticsRewardedContent,
  StatisticsRewardedContentModel,
  StatisticsRewardedContentPropsKey,
} from "./statistics-rewarded-content"

import {
  StatisticsRewardedResult
} from "../../services/api"

import { logError } from "../../utils/error"

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
    fetchData: flow(function * () {
      self.setFetching()
      self.contents.replace({})
      try {
        const result: StatisticsRewardedResult =
          yield self.env.likeCoAPI.fetchRewardedStatistics(
            self.getStartDateWithLimit().valueOf(),
            self.getEndDate().valueOf()
          )
        if (result.kind !== "ok") {
          throw new Error("STATS_FETCH_REWARDED_FAILED")
        }

        const days: StatisticsRewardedDay[] = []
        result.data.daily.forEach((contents, i) => {
          const day = StatisticsRewardedDayModel.create({}, self.env)
          days.push(day)
          if (contents && contents.length > 0) {
            const dailyContents: StatisticsRewardedContent[] = []
            contents.forEach(({
              sourceURL: url,
              LIKE: likeAmount,
              LIKEDetails: {
                basic: basicLikeAmount,
                civic: civicLikeAmount,
              },
              likeCount: likesCount,
              likerCount: {
                basic: basicLikersCount,
                civic: civicLikersCount,
              },
            }) => {
              const dailyContentID = `${self.startTs}-${i + 1}-${url}`
              const dailyContent = StatisticsRewardedContentModel.create({
                id: dailyContentID,
                likeAmount,
                likesCount,
                basicLikeAmount,
                civicLikeAmount,
                basicLikersCount,
                civicLikersCount,
              }, self.env)
              const contentInfo = self.createContentFromURL(url)
              if (contentInfo) {
                dailyContent.setInfo(contentInfo)
              }
              dailyContents.push(dailyContent)

              // Accumulate content stats for the week
              const weeklyContentID = `${self.startTs}-${url}`
              let weeklyContent = self.contents.get(weeklyContentID)
              if (weeklyContent) {
                weeklyContent.accumulate({
                  likeAmount,
                  basicLikeAmount,
                  civicLikeAmount,
                  likesCount,
                  basicLikersCount,
                  civicLikersCount,
                })
              } else {
                weeklyContent = StatisticsRewardedContentModel.create({
                  id: weeklyContentID,
                  likeAmount,
                  basicLikeAmount,
                  civicLikeAmount,
                  likesCount,
                  basicLikersCount,
                  civicLikersCount,
                }, self.env)
                if (contentInfo) {
                  weeklyContent.setInfo(contentInfo)
                }
                self.contents.put(weeklyContent)
              }
            })
            day.setContents(dailyContents)
          }
        })
        self.days.replace(days)
      } catch (error) {
        logError(error.message)
      } finally {
        self.setFetched()
      }
    }),
  }))

type StatisticsRewardedWeekType = Instance<typeof StatisticsRewardedWeekModel>
export interface StatisticsRewardedWeek extends StatisticsRewardedWeekType {}
type StatisticsRewardedWeekSnapshotType = SnapshotOut<typeof StatisticsRewardedWeekModel>
export interface StatisticsRewardedWeekSnapshot extends StatisticsRewardedWeekSnapshotType {}
