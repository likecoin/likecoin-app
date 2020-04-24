import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import {
  StatisticsSupportedCreator,
  StatisticsSupportedCreatorModel,
} from "./statistics-supported-creator"
import {
  StatisticsSupportedDay,
  StatisticsSupportedDayModel,
} from "./statistics-supported-day"
import {
  StatisticsSupportedContentModel,
} from "./statistics-supported-content"
import {
  StatisticsWeekModel,
} from "./statistics-week"

import { StatisticsSupportedResult } from "../../services/api"
import { logError } from "../../utils/error"

/**
 * Weekly model for supported statistics
 */
export const StatisticsSupportedWeekModel = StatisticsWeekModel
  .named("StatisticsSupportedWeek")
  .props({
    worksCount: types.optional(types.number, 0),
    likeAmount: types.optional(types.number, 0.0),
    likesCount: types.optional(types.number, 0),
    creators: types.array(StatisticsSupportedCreatorModel),
    days: types.array(StatisticsSupportedDayModel),
  })
  .views(self => ({
    get creatorsCount() {
      return self.creators.length
    },
  }))
  .actions(self => ({
    setWorksCount(worksCount: number) {
      self.worksCount = worksCount
    },
    setLikeAmount(likeAmount: number) {
      self.likeAmount = likeAmount
    },
    setLikesCount(likesCount: number) {
      self.likesCount = likesCount
    },
    setCreators(creators: StatisticsSupportedCreator[]) {
      self.creators.replace(creators)
    },
    setDays(days: StatisticsSupportedDay[]) {
      self.days.replace(days)
    },
    fetchData: flow(function * () {
      self.setFetching()
      try {
        const result: StatisticsSupportedResult =
          yield self.env.likeCoAPI.fetchSupportedStatistics(
            self.startTs,
            self.getEndDate().valueOf()
          )
        if (result.kind !== "ok") {
          throw new Error("STATS_FETCH_SUPPORTED_FAILED")
        }

        self.worksCount = result.data.workCount
        self.likesCount = result.data.likeCount
        self.likeAmount = result.data.LIKE
        self.creators.replace(result.data.all.map(({ likee, workCount, LIKE, likeCount }) => {
          const creator = StatisticsSupportedCreatorModel.create({
            likerID: likee,
            likeAmount: LIKE,
            likesCount: likeCount,
            worksCount: workCount,
          }, self.env)
          creator.setInfo(self.readerStore.createCreatorFromLikerId(likee))
          return creator
        }))
        self.days.replace(
          result.data.daily.map((contents, i) => {
            const dayID = `${self.startTs}-${i + 1}`
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
        self.setFetched()
      }
    }),
  }))

type StatisticsSupportedWeekType = Instance<typeof StatisticsSupportedWeekModel>
export interface StatisticsSupportedWeek extends StatisticsSupportedWeekType {}
type StatisticsSupportedWeekSnapshotType = SnapshotOut<typeof StatisticsSupportedWeekModel>
export interface StatisticsSupportedWeekSnapshot extends StatisticsSupportedWeekSnapshotType {}
