import {
  applySnapshot,
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import { Moment } from "moment"

import {
  StatisticsStoreModel,
  StatisticsStoreFetchLatestOptions,
  StatisticsStoreFetchWeekOptions,
} from "./statistics-store"
import {
  StatisticsSupportedWeekModel,
} from "./statistics-supported-week"

import { CreatorModel, Creator } from "../creator"

import {
  StatisticsTopSupportedCreatorsResult,
} from "../../services/api"
import { logError } from "../../utils/error"

/**
 * Store for supported statistics
 */
export const StatisticsSupportedStoreModel = StatisticsStoreModel
  .named("StatisticsSupportedStore")
  .props({
    weeks: types.map(StatisticsSupportedWeekModel),
    selectedWeek: types.safeReference(StatisticsSupportedWeekModel),
    topSupportedCreators: types.array(types.safeReference(CreatorModel)),
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
  .actions(self => ({
    reset() {
      applySnapshot(self, {})
    },
    fetchWeek: flow(function * (
      startDate: Moment,
      options?: StatisticsStoreFetchWeekOptions
    ) {
      const opts: StatisticsStoreFetchWeekOptions = {
        shouldSelect: false,
        skipIfFetched: false,
        ...options,
      }
      const startTs = startDate.valueOf()
      let week = self.weeks.get(startTs.toString())
      if (!week) {
        week = StatisticsSupportedWeekModel.create({ startTs }, self.env)
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
    fetchTopSupportedCreators: flow(function * () {
      try {
        const result: StatisticsTopSupportedCreatorsResult =
          yield self.env.likeCoAPI.fetchTopSupportedCreators()

        if (result.kind !== "ok") {
          throw new Error("STATS_FETCH_TOP_SUPPORTED_CREATORS_FAILED")
        }

        const creators: Creator[] = []
        const fetchDetailsPromises = []
        result.data.ids.forEach(likerID => {
          const creator = self.readerStore.createCreatorFromLikerId(likerID)
          creators.push(creator)
          if (!creator.hasFetchedDetails) {
            fetchDetailsPromises.push(creator.fetchDetails())
          }
        })
        yield Promise.all(fetchDetailsPromises)
        self.topSupportedCreators.replace(creators)
      } catch (error) {
        logError(error.message)
      }
    }),
  }))
  .actions(self => ({
    fetchLatest: flow(function * (options?: StatisticsStoreFetchLatestOptions) {
      const opts: StatisticsStoreFetchLatestOptions = {
        shouldFetchLastWeek: false,
        ...options,
      }
      const promises = [self.fetchWeek(self.getStartOfThisWeek(), { shouldSelect: true })]
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

type StatisticsSupportedStoreType = Instance<typeof StatisticsSupportedStoreModel>
export interface StatisticsSupportedStore extends StatisticsSupportedStoreType {}
type StatisticsSupportedStoreSnapshotType = SnapshotOut<typeof StatisticsSupportedStoreModel>
export interface StatisticsSupportedStoreSnapshot extends StatisticsSupportedStoreSnapshotType {}

export function handleStatisticsSupportedStoreSnapshot(
  {
    weeks,
    ...snapshot
  }: StatisticsSupportedStoreSnapshot
): StatisticsSupportedStoreSnapshot {
  return {
    weeks: Object.keys(weeks).sort().reverse().slice(0, 5).reduce((newWeeks, weekID) => {
      newWeeks[weekID] = weeks[weekID]
      return newWeeks
    }, {}),
    ...snapshot
  }
}
