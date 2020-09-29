import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import { BookmarkResult, BookmarksResult } from "../../services/api"
import { logError } from "../../utils/error"

import { Content } from "../content"
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
    get list() {
      return [...self.contentBookmarksStore.items.values()]
    },
  }))
  .views(self => ({
    get contents() {
      const bookmarks: Content[] = []
      const archives: Content[] = []
      self.list
        .sort(
          (bookmarkA, bookmarkB) => bookmarkB.timestamp - bookmarkA.timestamp,
        )
        .forEach(bookmark => {
          const content = self.getContentFromURL(bookmark.url)
          if (content.isArchived) {
            archives.push(content)
          } else {
            bookmarks.push(content)
          }
        })
      return {
        bookmarks,
        archives,
      }
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
              archived: "",
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
              archived: "",
              after:
                self.list[self.list.length - 1].timestamp,
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
