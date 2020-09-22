import {
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import moment from "moment"

import { withContentsStore, withEnvironment } from "../extensions"
import { StateModel } from "../state"

/**
 * Weekly model for statistics
 */
export const StatisticsWeekModel = StateModel
  .named("StatisticsWeek")
  .extend(withEnvironment)
  .extend(withContentsStore)
  .props({
    startTs: types.identifierNumber,
  })
  .views(self => ({
    getOldestDate() {
      return moment(self.env.appConfig.getValue("STATISTICS_OLDEST_DATE")).startOf("day")
    },
    getStartDate() {
      return moment(self.startTs)
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
    getIsOldest() {
      const oldestWeek = self.getOldestDate().startOf("week")
      return self.getPreviousWeekStartDate().isBefore(oldestWeek)
    },
  }))
  .views(self => ({
    getStartDateWithLimit() {
      return self.getIsOldest() ? self.getOldestDate() : self.getStartDate()
    },
  }))

type StatisticsWeekType = Instance<typeof StatisticsWeekModel>
export interface StatisticsWeek extends StatisticsWeekType {}
type StatisticsWeekSnapshotType = SnapshotOut<typeof StatisticsWeekModel>
export interface StatisticsWeekSnapshot extends StatisticsWeekSnapshotType {}
