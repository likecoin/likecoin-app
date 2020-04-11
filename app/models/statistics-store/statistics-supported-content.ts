import {
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { ContentModel, Content } from "../content"

/**
 * Content model for supported statistics
 */
export const StatisticsSupportedContentModel = types
  .model("StatisticsSupportedContent")
  .props({
    contentURL: types.identifier,
    info: types.maybe(types.safeReference(types.late(() => ContentModel))),
    likeAmount: types.optional(types.number, 0.0),
    likesCount: types.optional(types.number, 0),
    civicLikersCount: types.optional(types.number, 0),
    basicLikersCount: types.optional(types.number, 0),
  })
  .actions(self => ({
    setInfo(info: Content) {
      self.info = info
    },
  }))

type StatisticsSupportedContentType = Instance<typeof StatisticsSupportedContentModel>
export interface StatisticsSupportedContent extends StatisticsSupportedContentType {}
type StatisticsSupportedContentSnapshotType = SnapshotOut<typeof StatisticsSupportedContentModel>
export interface StatisticsSupportedContentSnapshot extends StatisticsSupportedContentSnapshotType {}
