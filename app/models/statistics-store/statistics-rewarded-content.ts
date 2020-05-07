import {
  Instance,
  SnapshotOut,
} from "mobx-state-tree"

import { StatisticsContentModel } from "./statistics-content"

/**
 * Content model for rewarded statistics
 */
export const StatisticsRewardedContentModel = StatisticsContentModel
  .named("StatisticsRewardedContent")
  .actions(self => ({
    accumulate({
      likeAmount = 0.0,
      basicLikeAmount = 0.0,
      civicLikeAmount = 0.0,
      likesCount = 0,
      basicLikersCount = 0,
      civicLikersCount = 0,
    }) {
      self.likeAmount += likeAmount
      self.basicLikeAmount += basicLikeAmount
      self.civicLikeAmount += civicLikeAmount
      self.likesCount += likesCount
      self.basicLikersCount += basicLikersCount
      self.civicLikersCount += civicLikersCount
    },
  }))

type StatisticsRewardedContentType = Instance<typeof StatisticsRewardedContentModel>
export interface StatisticsRewardedContent extends StatisticsRewardedContentType {}
export type StatisticsRewardedContentPropsKey = keyof typeof StatisticsRewardedContentModel.properties
type StatisticsRewardedContentSnapshotType = SnapshotOut<typeof StatisticsRewardedContentModel>
export interface StatisticsRewardedContentSnapshot extends StatisticsRewardedContentSnapshotType {}
