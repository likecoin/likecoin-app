import {
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import {
  StatisticsSupportedContent,
  StatisticsSupportedContentModel,
} from "./statistics-supported-content"

/**
 * Daily model for supported statistics
 */
export const StatisticsSupportedDayModel = types
  .model("StatisticsSupportedDay")
  .props({
    dayID: types.identifier,
    contents: types.array(StatisticsSupportedContentModel),
    totalCreatorsCount: types.optional(types.number, 0),
  })
  .views(self => ({
    get totalLikeAmount() {
      return self.contents.reduce((amount, content) => amount + content.likeAmount, 0)
    },
    get totalWorksCount() {
      return self.contents.length
    },
  }))
  .actions(self => ({
    setTotalCreatorsCount(count: number) {
      self.totalCreatorsCount = count
    },
    setContents(contents: StatisticsSupportedContent[]) {
      self.contents.replace(contents)
    },
  }))

type StatisticsSupportedDayType = Instance<typeof StatisticsSupportedDayModel>
export interface StatisticsSupportedDay extends StatisticsSupportedDayType {}
type StatisticsSupportedDaySnapshotType = SnapshotOut<typeof StatisticsSupportedDayModel>
export interface StatisticsSupportedDaySnapshot extends StatisticsSupportedDaySnapshotType {}
