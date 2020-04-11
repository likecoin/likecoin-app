import {
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import moment from "moment"

import {
  StatisticsSupportedCreator,
  StatisticsSupportedCreatorModel,
} from "./statistics-supported-creator"
import {
  StatisticsSupportedDay,
  StatisticsSupportedDayModel,
} from "./statistics-supported-day"

import { StateModel } from "../state"

/**
 * Weekly model for supported statistics
 */
export const StatisticsSupportedWeekModel = StateModel
  .named("StatisticsSupportedWeek")
  .props({
    startTs: types.identifierNumber,
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
    getStartDate() {
      return moment.unix(self.startTs)
    },
  }))
  .views(self => ({
    getEndDate() {
      return moment(self.getStartDate()).endOf("week")
    },
  }))
  .views(self => ({
    getPeriodText(format = "YYYY.MM.DD") {
      return `${self.getStartDate().format(format)} - ${self.getEndDate().format(format)}`
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
  }))

type StatisticsSupportedWeekType = Instance<typeof StatisticsSupportedWeekModel>
export interface StatisticsSupportedWeek extends StatisticsSupportedWeekType {}
type StatisticsSupportedWeekSnapshotType = SnapshotOut<typeof StatisticsSupportedWeekModel>
export interface StatisticsSupportedWeekSnapshot extends StatisticsSupportedWeekSnapshotType {}
