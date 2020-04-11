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
  }))
  .actions(self => ({
    fetchDataForWeek: flow(function * (startTs: number, isSelected = false) {
      let weekData = self.weeksData.get(startTs.toString())
      if (!weekData) {
        weekData = StatisticsSupportedWeekModel.create({ startTs }, self.env)
        self.weeksData.put(weekData)
      }
      if (isSelected) self.selectedWeek = weekData
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
    fetchLatest: flow(function * () {
      const currentWeek = moment().startOf("week")
      self.weeksData.replace({})
      yield Promise.all([
        self.fetchDataForWeek(currentWeek.unix(), true),
        self.fetchDataForWeek(moment(currentWeek).subtract(1, "week").unix(), true),
      ])
    }),
    selectWeek(weekIndex: number) {
      const weekData = self.weeks[weekIndex]
      self.selectedWeek = weekData
      if (weekIndex === self.weeks.length - 1) {
        const prevWeek = moment.unix(weekData.startTs).subtract(1, "week")
        self.fetchDataForWeek(prevWeek.unix())
      }
    },
  }))

type StatisticsSupportedStoreType = Instance<typeof StatisticsSupportedStoreModel>
export interface StatisticsSupportedStore extends StatisticsSupportedStoreType {}
type StatisticsSupportedStoreSnapshotType = SnapshotOut<typeof StatisticsSupportedStoreModel>
export interface StatisticsSupportedStoreSnapshot extends StatisticsSupportedStoreSnapshotType {}
