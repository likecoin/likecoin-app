import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import { BookmarkResult, BookmarksResult } from "../../services/api"
import { logError } from "../../utils/error"

import { ContentBookmark, ContentBookmarkModel } from "../content-bookmark"
import {
  withContentBookmarksStore,
  withContentsStore,
  withEnvironment,
  withStatus,
} from "../extensions"

/**
 * This model is for preventing circular dependency for `ContentsStore` and
 * `ContentBookmarksStore`. Therefore, the store do not have any props.
 */
export const ContentBookmarksListStoreModel = types
  .model("ContentBookmarksListStore")
  .extend(withEnvironment)
  .extend(withContentsStore)
  .extend(withContentBookmarksStore)
  .extend(withStatus)
  .views(self => ({
    get contents() {
      return [...self.contentBookmarksStore.items.values()]
        .sort(
          (bookmarkA, bookmarkB) => bookmarkB.timestamp - bookmarkA.timestamp,
        )
        .map(bookmark => {
          return self.getContentFromURL(bookmark.url)
        })
    },
  }))
  .actions(self => {
    function createContentBookmarksFromResultList(results: BookmarkResult[]) {
      const bookmarks: ContentBookmark[] = []
      results.forEach(result => {
        const { id, url, ts: timestamp } = result
        let bookmark: ContentBookmark
        self.createContentFromURL(url)
        if (!self.checkIsBookmarkedURL(url)) {
          bookmark = ContentBookmarkModel.create({
            id,
            timestamp,
            url,
          })
          bookmarks.push(bookmark)
        }
      })
      self.contentBookmarksStore.addAll(bookmarks)
      return bookmarks
    }

    return {
      fetch: flow(function*() {
        if (self.status === "pending") return
        try {
          self.status = "pending"
          const result: BookmarksResult = yield self.env.likeCoinAPI.users.bookmarks.get(
            {
              archived: 0,
            },
          )
          if (result.kind === "ok") {
            createContentBookmarksFromResultList(result.data)
          }
        } catch (error) {
          logError(error)
        } finally {
          self.status = "done"
        }
      }),
      fetchMore: flow(function*() {
        if (self.status === "pending" || self.status === "pending-more") return
        try {
          self.status = "pending-more"
          const result: BookmarksResult = yield self.env.likeCoinAPI.users.bookmarks.get(
            {
              archived: 0,
              after:
                self.contents[self.contents.length - 1].bookmarkedTimestamp,
            },
          )
          if (result.kind === "ok") {
            if (!createContentBookmarksFromResultList(result.data).length) {
              self.status = "done-more"
            }
          }
        } catch (error) {
          logError(error)
        } finally {
          if (self.status !== "done-more") {
            self.status = "done"
          }
        }
      }),
    }
  })

type ContentBookmarksListStoreType = Instance<
  typeof ContentBookmarksListStoreModel
>
export interface ContentBookmarksListStore
  extends ContentBookmarksListStoreType {}
type ContentBookmarksListStoreSnapshotType = SnapshotOut<
  typeof ContentBookmarksListStoreModel
>
export interface ContentBookmarksListStoreSnapshot
  extends ContentBookmarksListStoreSnapshotType {}
