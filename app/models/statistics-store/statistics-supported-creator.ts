import {
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { CreatorModel, Creator } from "../creator"

/**
 * Creator model for supported statistics
 */
export const StatisticsSupportedCreatorModel = types
  .model("StatisticsSupportedCreator")
  .props({
    likerID: types.identifier,
    info: types.maybe(types.safeReference(types.late(() => CreatorModel))),
    likeAmount: types.optional(types.number, 0.0),
    likesCount: types.optional(types.number, 0),
    worksCount: types.optional(types.number, 0),
  })
  .actions(self => ({
    setInfo(info: Creator) {
      self.info = info
    },
  }))

type StatisticsSupportedCreatorType = Instance<typeof StatisticsSupportedCreatorModel>
export interface StatisticsSupportedCreator extends StatisticsSupportedCreatorType {}
type StatisticsSupportedCreatorSnapshotType = SnapshotOut<typeof StatisticsSupportedCreatorModel>
export interface StatisticsSupportedCreatorSnapshot extends StatisticsSupportedCreatorSnapshotType {}
