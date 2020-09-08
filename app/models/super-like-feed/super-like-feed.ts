import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { withEnvironment, withReaderStore, withStatus } from "../extensions"
import { SuperLikeModel } from "../super-like"

/**
 * Super Like feed.
 */
export const SuperLikeFeedModel = types
  .model("SuperLikeFeed")
  .props({
    /**
     * Super Like items.
     */
    items: types.array(SuperLikeModel),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .extend(withReaderStore)

type SuperLikeFeedType = Instance<typeof SuperLikeFeedModel>
export interface SuperLikeFeed extends SuperLikeFeedType {}
type SuperLikeFeedSnapshotType = SnapshotOut<typeof SuperLikeFeedModel>
export interface SuperLikeFeedSnapshot extends SuperLikeFeedSnapshotType {}
