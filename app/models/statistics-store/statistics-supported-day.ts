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
  })
  .views(self => ({
    get totalLikeAmount() {
      return self.contents.reduce((amount, content) => amount + content.likeAmount, 0)
    },
  }))
  .actions(self => ({
    setContents(contents: StatisticsSupportedContent[]) {
      self.contents.replace(contents)
    },
  }))

type StatisticsSupportedDayType = Instance<typeof StatisticsSupportedDayModel>
export interface StatisticsSupportedDay extends StatisticsSupportedDayType {}
type StatisticsSupportedDaySnapshotType = SnapshotOut<typeof StatisticsSupportedDayModel>
export interface StatisticsSupportedDaySnapshot extends StatisticsSupportedDaySnapshotType {}
