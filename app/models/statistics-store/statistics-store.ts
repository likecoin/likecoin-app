import {
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import moment from "moment"

import { withCreatorsStore, withEnvironment } from "../extensions"

export interface StatisticsStoreFetchWeekOptions {
  shouldSelect?: boolean
  skipIfFetched?: boolean
}
export interface StatisticsStoreFetchLatestOptions {
  shouldFetchLastWeek?: boolean
}

/**
 * Store for statistics
 */
export const StatisticsStoreModel = types
  .model("StatisticsStore")
  .extend(withEnvironment)
  .extend(withCreatorsStore)
  .volatile(() => ({
    selectedDayOfWeek: -1,
  }))
  .views(self => ({
    get hasSelectedDayOfWeek() {
      return self.selectedDayOfWeek >= 0
    },
    getStartOfThisWeek() {
      return moment().startOf("week")
    },
    getStartOfLastWeek() {
      return moment().subtract(1, "week").startOf("week")
    },

  }))
  .actions(self => ({
    deselectDayOfWeek() {
      self.selectedDayOfWeek = -1
    },
  }))
  .actions(self => ({
    selectDayOfWeek(weekday: number) {
      if (weekday === self.selectedDayOfWeek) {
        self.deselectDayOfWeek()
      } else {
        self.selectedDayOfWeek = weekday
      }
    },
  }))

type StatisticsStoreType = Instance<typeof StatisticsStoreModel>
export interface StatisticsStore extends StatisticsStoreType {}
type StatisticsStoreSnapshotType = SnapshotOut<typeof StatisticsStoreModel>
export interface StatisticsStoreSnapshot extends StatisticsStoreSnapshotType {}
