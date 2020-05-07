import {
  Instance,
  SnapshotOut,
} from "mobx-state-tree"

import { StatisticsContentModel } from "./statistics-content"

/**
 * Content model for supported statistics
 */
export const StatisticsSupportedContentModel = StatisticsContentModel
  .named("StatisticsSupportedContent")

type StatisticsSupportedContentType = Instance<typeof StatisticsSupportedContentModel>
export interface StatisticsSupportedContent extends StatisticsSupportedContentType {}
type StatisticsSupportedContentSnapshotType = SnapshotOut<typeof StatisticsSupportedContentModel>
export interface StatisticsSupportedContentSnapshot extends StatisticsSupportedContentSnapshotType {}
