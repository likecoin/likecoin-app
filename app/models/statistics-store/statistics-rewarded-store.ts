import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import moment, { Moment } from "moment"

import {
  StatisticsStoreModel,
  StatisticsStoreFetchWeekOptions,
  StatisticsStoreFetchLatestOptions,
} from "./statistics-store"
import {
  StatisticsRewardedDayModel, StatisticsRewardedDay,
} from "./statistics-rewarded-day"
import {
  StatisticsRewardedWeekModel, StatisticsRewardedWeek,
} from "./statistics-rewarded-week"
import {
  StatisticsRewardedContentModel, StatisticsRewardedContent,
} from "./statistics-rewarded-content"

import { StatisticsRewardedResult, StatisticsRewardedSummaryResult } from "../../services/api"
import { logError } from "../../utils/error"

/**
 * Store for rewarded statistics
 */
export const StatisticsRewardedStoreModel = StatisticsStoreModel
  .named("StatisticsRewardedStore")
  .props({
    weeks: types.map(StatisticsRewardedWeekModel),
    selectedWeek: types.safeReference(StatisticsRewardedWeekModel),
    totalLikeAmount: types.optional(types.number, 0),
  })
  .volatile(() => ({
  }))
  .views(self => ({
    get weekList() {
      return [...self.weeks.values()].sort((weekA, weekB) => {
        if (weekA.startTs === weekB.startTs) {
          return 0
        } else if (weekA.startTs < weekB.startTs) {
          return 1
        }
        return -1
      })
    },
  }))
  .views(self => ({
    getWeekByIndex(index: number) {
      return self.weekList[index]
    },
  }))
  .actions(self => ({
    fetchSummary: flow(function * () {
      try {
        const result: StatisticsRewardedSummaryResult =
          yield self.env.likeCoAPI.fetchRewardedStatisticsSummary(
            moment().startOf("week").valueOf(),
            moment().endOf("week").valueOf()
          )
        if (result.kind !== "ok") {
          throw new Error("STATS_FETCH_REWARDED_SUMMARY_FAILED")
        }
        const {
          LIKE: {
            CreatorsFunds: likeAmountFromCreatorFunds = 0,
            CivicLiker: likeAmountFromCivicLiker = 0,
          },
        } = result.data
        self.totalLikeAmount =
          likeAmountFromCreatorFunds + likeAmountFromCivicLiker
      } catch (error) {
        logError(error.message)
      }
    }),
    fetchWeek: flow(function * (
      startDate: Moment,
      options?: StatisticsStoreFetchWeekOptions
    ) {
      const opts: StatisticsStoreFetchWeekOptions = {
        shouldSelect: false,
        ...options,
      }
      const startTs = startDate.valueOf()
      let week: StatisticsRewardedWeek = self.weeks.get(startTs.toString())
      if (!week) {
        week = StatisticsRewardedWeekModel.create({ startTs }, self.env)
        self.weeks.put(week)
      }
      if (opts.shouldSelect) {
        self.selectedWeek = week
      }
      week.setFetching()
      week.contents.replace({})

      try {
        const result: StatisticsRewardedResult =
          yield self.env.likeCoAPI.fetchRewardedStatistics(
            week.startTs,
            week.getEndDate().valueOf()
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
              const dailyContentID = `${startTs}-${i + 1}-${url}`
              const dailyContent = StatisticsRewardedContentModel.create({
                id: dailyContentID,
                likeAmount,
                likesCount,
                basicLikeAmount,
                civicLikeAmount,
                basicLikersCount,
                civicLikersCount,
              }, self.env)
              const contentInfo = self.readerStore.getContentByURL(url)
              if (contentInfo) {
                dailyContent.setInfo(contentInfo)
              }
              dailyContents.push(dailyContent)

              // Accumulate content stats for the week
              const weeklyContentID = `${startTs}-${url}`
              let weeklyContent = week.contents.get(weeklyContentID)
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
                week.contents.put(weeklyContent)
              }
            })
            day.setContents(dailyContents)
          }
        })
        week.setDays(days)
      } catch (error) {
        logError(error.message)
      } finally {
        week.setFetched()
      }
      return week
    }),
  }))
  .actions(self => ({
    fetchLatest: flow(function * (options?: StatisticsStoreFetchLatestOptions) {
      const opts: StatisticsStoreFetchLatestOptions = {
        shouldFetchLastWeek: false,
        ...options,
      }
      const promises = [self.fetchWeek(self.getStartOfThisWeek(), { shouldSelect: true, })]
      if (opts.shouldFetchLastWeek) {
        promises.push(self.fetchWeek(self.getStartOfLastWeek()))
      }
      yield Promise.all(promises)
    }),
    selectWeek(weekIndex: number) {
      if (self.hasSelectedDayOfWeek) {
        self.deselectDayOfWeek()
      }
      const week = self.weekList[weekIndex]
      self.selectedWeek = week
      if (!week.hasRecentlyFetched) {
        self.fetchWeek(week.getStartDate())
      }
      if (weekIndex === self.weekList.length - 1) {
        self.fetchWeek(week.getPreviousWeekStartDate())
      }
    },
  }))

type StatisticsRewardedStoreType = Instance<typeof StatisticsRewardedStoreModel>
export interface StatisticsRewardedStore extends StatisticsRewardedStoreType {}
type StatisticsRewardedStoreSnapshotType = SnapshotOut<typeof StatisticsRewardedStoreModel>
export interface StatisticsRewardedStoreSnapshot extends StatisticsRewardedStoreSnapshotType {}

export function handleStatisticsRewardedStoreSnapshot(
  {
    weeks,
    ...snapshot
  }: StatisticsRewardedStoreSnapshot
): StatisticsRewardedStoreSnapshot {
  return {
    weeks: Object.keys(weeks).sort().reverse().slice(0, 5).reduce((newWeeks, weekID) => {
      newWeeks[weekID] = weeks[weekID]
      return newWeeks
    }, {}),
    ...snapshot
  }
}
