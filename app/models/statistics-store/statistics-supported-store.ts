import {
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
  StatisticsSupportedCreatorModel,
} from "./statistics-supported-creator"
import {
  StatisticsSupportedContentModel,
} from "./statistics-supported-content"
import {
  StatisticsSupportedDayModel,
} from "./statistics-supported-day"
import {
  StatisticsSupportedWeekModel,
} from "./statistics-supported-week"

import { logError } from "../../utils/error"
import { StatisticsSupportedResult } from "../../services/api"

/**
 * Store for supported statistics
 */
export const StatisticsSupportedStoreModel = StatisticsStoreModel
  .named("StatisticsSupportedStore")
  .props({
    weeks: types.map(StatisticsSupportedWeekModel),
    selectedWeek: types.safeReference(StatisticsSupportedWeekModel),
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
    fetchWeek: flow(function * (
      startDate: Moment,
      options?: StatisticsStoreFetchWeekOptions
    ) {
      const opts: StatisticsStoreFetchWeekOptions = {
        shouldSelect: false,
        ...options,
      }
      const startTs = startDate.unix()
      let week = self.weeks.get(startTs.toString())
      if (!week) {
        week = StatisticsSupportedWeekModel.create({ startTs }, self.env)
        self.weeks.put(week)
      }
      if (opts.shouldSelect) {
        self.selectedWeek = week
      }
      week.setFetching()
      try {
        const result: StatisticsSupportedResult =
          yield self.env.likeCoAPI.fetchSupportedStatistics()
        if (result.kind !== "ok") {
          throw new Error("STATS_FETCH_SUPPORTED_FAILED")
        }

        week.setWorksCount(result.data.workCount)
        week.setLikesCount(result.data.likeCount)
        week.setLikeAmount(result.data.LIKE)
        week.setCreators(result.data.all.map(({ likee, workCount, LIKE, likeCount }) => {
          const creator = StatisticsSupportedCreatorModel.create({
            likerID: likee,
            likeAmount: LIKE,
            likesCount: likeCount,
            worksCount: workCount,
          }, self.env)
          creator.setInfo(self.readerStore.createCreatorFromLikerId(likee))
          return creator
        }))
        week.setDays(
          result.data.daily.map((contents, i) => {
            const dayID = `${startTs}-${i + 1}`
            const day = StatisticsSupportedDayModel.create({ dayID }, self.env)
            if (contents && contents.length > 0) {
              day.setContents(contents.map(({ sourceURL: url, LIKE, likeCount }) => {
                const content = StatisticsSupportedContentModel.create({
                  id: url,
                  likeAmount: LIKE,
                  likesCount: likeCount,
                }, self.env)
                content.setInfo(self.readerStore.getContentByURL(url))
                return content
              }))
            }
            return day
          })
        )
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
      if (weekIndex === self.weekList.length - 1) {
        self.fetchWeek(week.getPreviousWeekStartDate(), { shouldSelect: true })
      }
    },
  }))

type StatisticsSupportedStoreType = Instance<typeof StatisticsSupportedStoreModel>
export interface StatisticsSupportedStore extends StatisticsSupportedStoreType {}
type StatisticsSupportedStoreSnapshotType = SnapshotOut<typeof StatisticsSupportedStoreModel>
export interface StatisticsSupportedStoreSnapshot extends StatisticsSupportedStoreSnapshotType {}
