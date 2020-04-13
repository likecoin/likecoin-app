import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import moment from "moment"

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

import { withEnvironment, withReaderStore } from "../extensions"

import { logError } from "../../utils/error"
import { StatisticsSupportedResult } from "../../services/api"

export interface FetchDataForWeekOptions {
  shouldSelect?: boolean
}
export interface FetchLatestOptions {
  shouldFetchLastWeek?: boolean
}

/**
 * Store for supported statistics
 */
export const StatisticsSupportedStoreModel = types
  .model("StatisticsSupportedStore")
  .extend(withEnvironment)
  .extend(withReaderStore)
  .props({
    weeksData: types.map(StatisticsSupportedWeekModel),
    selectedWeek: types.safeReference(StatisticsSupportedWeekModel),
  })
  .volatile(() => ({
    selectedWeekday: -1,
  }))
  .views(self => ({
    get weeks() {
      return [...self.weeksData.values()].sort((weekA, weekB) => {
        if (weekA.startTs === weekB.startTs) {
          return 0
        } else if (weekA.startTs < weekB.startTs) {
          return 1
        }
        return -1
      })
    },
    get hasSelectedWeekday() {
      return self.selectedWeekday >= 0
    },
  }))
  .actions(self => ({
    deselectWeekday() {
      self.selectedWeekday = -1
    },
    fetchDataForWeek: flow(function * (startTs: number, options?: FetchDataForWeekOptions) {
      const opts: FetchDataForWeekOptions = {
        shouldSelect: false,
        ...options,
      }
      let weekData = self.weeksData.get(startTs.toString())
      if (!weekData) {
        weekData = StatisticsSupportedWeekModel.create({ startTs }, self.env)
        self.weeksData.put(weekData)
      }
      if (opts.shouldSelect) self.selectedWeek = weekData
      weekData.setFetching()
      try {
        const result: StatisticsSupportedResult = yield self.env.likeCoAPI.fetchSupportedStatistics()
        if (result.kind !== "ok") {
          throw new Error("STATS_FETCH_SUPPORTED_FAILED")
        }

        weekData.setWorksCount(result.data.workCount)
        weekData.setLikesCount(result.data.likeCount)
        weekData.setLikeAmount(result.data.LIKE)
        weekData.setCreators(result.data.all.map(({ likee, workCount, LIKE, likeCount }) => {
          const creator = StatisticsSupportedCreatorModel.create({
            likerID: likee,
            likeAmount: LIKE,
            likesCount: likeCount,
            worksCount: workCount,
          }, self.env)
          creator.setInfo(self.readerStore.createCreatorFromLikerId(likee))
          return creator
        }))
        weekData.setDays(
          result.data.daily.map((contents, i) => {
            const dayID = `${startTs}-${i + 1}`
            const day = StatisticsSupportedDayModel.create({ dayID }, self.env)
            if (contents && contents.length > 0) {
              day.setContents(contents.map(({ sourceURL: url, LIKE, likeCount }) => {
                const content = StatisticsSupportedContentModel.create({
                  contentURL: url,
                  likeAmount: LIKE,
                  likesCount: likeCount,
                }, self.env)
                content.setInfo(self.readerStore.createContentFromContentResultData({ url }))
                return content
              }))
            }
            return day
          })
        )
      } catch (error) {
        logError(error.message)
      } finally {
        weekData.setFetched()
      }
      return weekData
    }),
  }))
  .actions(self => ({
    fetchLatest: flow(function * (options?: FetchLatestOptions) {
      const opts: FetchLatestOptions = {
        shouldFetchLastWeek: false,
        ...options,
      }
      const currentWeek = moment().startOf("week")
      const promises = [
        self.fetchDataForWeek(currentWeek.unix(), {
          shouldSelect: true,
        }),
      ]
      if (opts.shouldFetchLastWeek) {
        const lastWeek = moment(currentWeek).subtract(1, "week")
        promises.push(
          self.fetchDataForWeek(lastWeek.unix())
        )
      }
      yield Promise.all(promises)
    }),
    selectWeek(weekIndex: number) {
      self.deselectWeekday()
      const weekData = self.weeks[weekIndex]
      self.selectedWeek = weekData
      if (weekIndex === self.weeks.length - 1) {
        const prevWeek = moment.unix(weekData.startTs).subtract(1, "week")
        self.fetchDataForWeek(prevWeek.unix(), { shouldSelect: true })
      }
    },
    selectWeekday(weekday: number) {
      if (weekday === self.selectedWeekday) {
        self.deselectWeekday()
      } else {
        self.selectedWeekday = weekday
      }
    },
  }))

type StatisticsSupportedStoreType = Instance<typeof StatisticsSupportedStoreModel>
export interface StatisticsSupportedStore extends StatisticsSupportedStoreType {}
type StatisticsSupportedStoreSnapshotType = SnapshotOut<typeof StatisticsSupportedStoreModel>
export interface StatisticsSupportedStoreSnapshot extends StatisticsSupportedStoreSnapshotType {}
