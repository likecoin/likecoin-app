import { Instance, SnapshotOut, types } from "mobx-state-tree"

import {
  ContentBookmark,
  ContentBookmarkModel,
  ContentBookmarkSnapshot,
} from "../content-bookmark"

const ContentBookmarksMapModel = types.map(ContentBookmarkModel)
type ContentBookmarksMapSnapshotType = SnapshotOut<
  typeof ContentBookmarksMapModel
>
interface ContentBookmarksMapSnapshot extends ContentBookmarksMapSnapshotType {}

/**
 * Store for all content bookmarks.
 */
const ContentBookmarksStoreBaseModel = types
  .model("ContentBookmarksStore")
  .props({
    items: ContentBookmarksMapModel,
  })
  .actions(self => ({
    reset() {
      self.items.replace({})
    },
    add(snapshot: Partial<ContentBookmarkSnapshot>) {
      const bookmark = self.items.get(snapshot.url)
      if (bookmark && bookmark.willBeDeleted) {
        bookmark.setWillBeDeleted(false)
      } else {
        self.items.put(ContentBookmarkModel.create(snapshot))
      }
    },
    remove(url: string) {
      const bookmark = self.items.get(url)
      if (bookmark) {
        bookmark.setWillBeDeleted(true)
      }
    },
  }))
  .actions(self => ({
    addAll(bookmarks: ContentBookmark[]) {
      bookmarks.forEach(bookmark => {
        self.items.put(bookmark)
      })
    },
  }))

export const ContentBookmarksStoreModel = types.snapshotProcessor(
  ContentBookmarksStoreBaseModel,
  {
    postProcessor(snapshot) {
      const items: ContentBookmarksMapSnapshot = {}
      Object.keys(snapshot.items)
        .filter(id => !snapshot.items[id].willBeDeleted)
        .sort((idA, idB) => {
          const bookmarkA = snapshot.items[idA]
          const bookmarkB = snapshot.items[idB]
          if (!bookmarkA) return -1
          if (!bookmarkB) return 1
          return bookmarkB.timestamp - bookmarkA.timestamp
        })
        .slice(0, 1000)
        .forEach(id => {
          items[id] = snapshot.items[id]
        })
      return {
        items,
      }
    },
  },
)

type ContentBookmarksStoreType = Instance<typeof ContentBookmarksStoreModel>
export interface ContentBookmarksStore extends ContentBookmarksStoreType {}
type ContentBookmarksStoreSnapshotType = SnapshotOut<
  typeof ContentBookmarksStoreModel
>
export interface ContentBookmarksStoreSnapshot
  extends ContentBookmarksStoreSnapshotType {}
