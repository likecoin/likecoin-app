import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Bookmarked content.
 */
export const ContentBookmarkModel = types
  .model("ContentBookmark")
  .props({
    url: types.identifier,
    id: types.maybe(types.string),
    timestamp: types.number,
  })

type ContentBookmarkType = Instance<typeof ContentBookmarkModel>
export interface ContentBookmark extends ContentBookmarkType {}
type ContentBookmarkSnapshotType = SnapshotOut<typeof ContentBookmarkModel>
export interface ContentBookmarkSnapshot extends ContentBookmarkSnapshotType {}
