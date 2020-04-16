import {
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import moment from "moment"

import { StateModel } from "../state"

/**
 * Weekly model for statistics
 */
export const StatisticsWeekModel = StateModel
  .named("StatisticsWeek")
  .props({
    startTs: types.identifierNumber,
  })
  .views(self => ({
    getStartDate() {
      return moment.unix(self.startTs)
    },
  }))
  .views(self => ({
    getEndDate() {
      return moment(self.getStartDate()).endOf("week")
    },
    getPreviousWeekStartDate() {
      return self.getStartDate().subtract(1, "week").startOf("week")
    },
  }))
  .views(self => ({
    getPeriodText(format = "YYYY.MM.DD") {
      const formattedStartDate = self.getStartDate().format(format)
      const formattedEndDate = self.getEndDate().format(format)
      return `${formattedStartDate} - ${formattedEndDate}`
    },
  }))

type StatisticsWeekType = Instance<typeof StatisticsWeekModel>
export interface StatisticsWeek extends StatisticsWeekType {}
type StatisticsWeekSnapshotType = SnapshotOut<typeof StatisticsWeekModel>
export interface StatisticsWeekSnapshot extends StatisticsWeekSnapshotType {}
