import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import { ContentModel } from "../content"
import { withContentsStore, withEnvironment } from "../extensions"

import { BookmarkListResult, GeneralResult } from "../../services/api/api.types"
import { logError } from "../../utils/error"

/**
 * Store all content related information.
 */
export const ReaderStoreModel = types
  .model("ReaderStore")
  .props({
    bookmarkList: types.array(
      types.safeReference(types.late(() => ContentModel)),
    ),
  })
  .volatile(() => ({
    isFetchingBookmarkList: false,
    hasFetchedBookmarkList: false,
  }))
  .extend(withEnvironment)
  .extend(withContentsStore)
  .actions(self => ({
    reset() {
      self.bookmarkList.replace([])
      self.isFetchingBookmarkList = false
      self.hasFetchedBookmarkList = false
    },
  }))
  .actions(self => ({
    fetchBookmarkList: flow(function*() {
      if (self.isFetchingBookmarkList) return
      self.isFetchingBookmarkList = true
      try {
        const result: BookmarkListResult = yield self.env.likerLandAPI.fetchReaderBookmark()
        switch (result.kind) {
          case "ok":
            self.bookmarkList.replace([])
            result.data.reverse().forEach(url => {
              const content = self.createContentFromURL(url)
              content.setIsBookmark(true)
              self.bookmarkList.push(content)
            })
        }
      } catch (error) {
        logError(error.message)
      } finally {
        self.isFetchingBookmarkList = false
        self.hasFetchedBookmarkList = true
      }
    }),
    toggleBookmark: flow(function*(url: string) {
      const content = self.contentsStore.items.get(url)
      if (!content) return
      const prevIsBookmarked = content.isBookmarked
      const prevBookmarkList = self.bookmarkList
      content.setIsBookmark(!content.isBookmarked)
      try {
        if (content.isBookmarked) {
          self.bookmarkList.splice(0, 0, content)
          const result: GeneralResult = yield self.env.likerLandAPI.addBookmark(
            content.url,
          )
          if (result.kind !== "ok") {
            throw new Error("READER_BOOKMARK_ADD_FAILED")
          }
        } else {
          self.bookmarkList.remove(content)
          const result: GeneralResult = yield self.env.likerLandAPI.removeBookmark(
            content.url,
          )
          if (result.kind !== "ok") {
            throw new Error("READER_BOOKMARK_REMOVE_FAILED")
          }
        }
      } catch (error) {
        logError(error.message)
        content.setIsBookmark(prevIsBookmarked)
        self.bookmarkList.replace(prevBookmarkList)
      }
    }),
  }))

type ReaderStoreType = Instance<typeof ReaderStoreModel>
export interface ReaderStore extends ReaderStoreType {}
type ReaderStoreSnapshotType = SnapshotOut<typeof ReaderStoreModel>
export interface ReaderStoreSnapshot extends ReaderStoreSnapshotType {}
