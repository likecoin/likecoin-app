import {
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { ContentModel, Content } from "../content"

/**
 * Content model for rewarded statistics
 */
export const StatisticsContentModel = types
  .model("StatisticsContent")
  .props({
    id: types.identifier,
    info: types.maybe(types.safeReference(types.late(() => ContentModel))),
    likeAmount: types.optional(types.number, 0.0),
    basicLikeAmount: types.optional(types.number, 0.0),
    civicLikeAmount: types.optional(types.number, 0.0),
    likesCount: types.optional(types.number, 0),
    basicLikersCount: types.optional(types.number, 0),
    civicLikersCount: types.optional(types.number, 0),
  })
  .actions(self => ({
    setInfo(info: Content) {
      self.info = info
    },
  }))

type StatisticsContentType = Instance<typeof StatisticsContentModel>
export interface StatisticsContent extends StatisticsContentType {}
type StatisticsContentSnapshotType = SnapshotOut<typeof StatisticsContentModel>
export interface StatisticsContentSnapshot extends StatisticsContentSnapshotType {}
