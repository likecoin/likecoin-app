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
    isArchived: types.optional(types.boolean, false),
    willBeDeleted: types.optional(types.boolean, false),
  })
  .actions(self => ({
    setIsArchived(value: boolean) {
      self.isArchived = value
    },
    setWillBeDeleted(value: boolean) {
      self.willBeDeleted = value
    },
  }))

type ContentBookmarkType = Instance<typeof ContentBookmarkModel>
export interface ContentBookmark extends ContentBookmarkType {}
type ContentBookmarkSnapshotType = SnapshotOut<typeof ContentBookmarkModel>
export interface ContentBookmarkSnapshot extends ContentBookmarkSnapshotType {}
