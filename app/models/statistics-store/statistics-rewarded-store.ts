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
  StatisticsRewardedWeek,
  StatisticsRewardedWeekModel,
} from "./statistics-rewarded-week"

import { StatisticsRewardedSummaryResult } from "../../services/api"

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
    get selectedLastWeek() {
      if (self.selectedWeek) {
        const selectedWeekIndex =
          self.weekList.findIndex(week => week.startTs === self.selectedWeek.startTs)
        return self.weekList[selectedWeekIndex + 1]
      }
      return undefined
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
      if (!(opts.skipIfFetched && week.hasFetched)) {
        yield week.fetchData()
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
      if (weekIndex === self.weekList.length - 1 && !week.getIsOldest()) {
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
