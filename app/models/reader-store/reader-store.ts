import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import { uniqBy } from "ramda"

import { Content, ContentModel } from "../content"
import { withEnvironment } from "../extensions"

import { ContentListResult, Content as ContentResult } from "../../services/api/api.types"
import { logError } from "../../utils/error"

const contentListTypes = types.array(types.reference(ContentModel))

function uniq(list: Content[]) {
  return uniqBy((c: Content) => c.url, list)
}

/**
 * Store all content related information.
 */
export const ReaderStoreModel = types
  .model("ReaderStore")
  .props({
    contents: types.map(ContentModel),
    featuredList: contentListTypes,
    followedList: contentListTypes,
  })
  .volatile(() => ({
    isFetchingSuggestList: false,
    hasFetchedSuggestList: false,
    isFetchingFollowedList: false,
    hasFetchedFollowedList: false,
    isFetchingMoreFollowedList: false,
    hasReachedEndOfFollowedList: false,
  }))
  .extend(withEnvironment)
  .views(self => ({
    get isLoading() {
      return self.isFetchingSuggestList ||
        self.isFetchingFollowedList
    },
  }))
  .actions(self => ({
    parseContentListResult(contents: ContentResult[]) {
      const parsedContents: Content[] = []
      contents.forEach(({ referrer: url, ts }) => {
        let content = self.contents.get(url)
        if (!content) {
          content = ContentModel.create({ url })
          self.contents.set(url, content)
        }
        content.setTimestamp(ts)
        parsedContents.push(content)
      })
      return uniq(parsedContents)
    },
  }))
  .actions(self => ({
    clearAllLists: () => {
      self.featuredList.replace([])
      self.followedList.replace([])
    },
    getContentByURL: (url: string) => {
      // TODO: Refactor
      let content = self.contents.get(url)
      if (!content) {
        content = ContentModel.create({ url })
        self.contents.set(url, content)
      }
      return content
    },
    fetchSuggestList: flow(function * () {
      self.isFetchingSuggestList = true
      try {
        const result: ContentListResult = yield self.env.likerLandAPI.fetchReaderSuggest()
        switch (result.kind) {
          case "ok":
            self.featuredList.replace(self.parseContentListResult(result.data))
        }
      } catch (error) {
        logError(error.message)
      } finally {
        self.isFetchingSuggestList = false
        self.hasFetchedSuggestList = true
      }
    }),
    fetchFollowedList: flow(function * () {
      self.isFetchingFollowedList = true
      try {
        const result: ContentListResult = yield self.env.likerLandAPI.fetchReaderFollowing()
        switch (result.kind) {
          case "ok":
            self.followedList.replace(self.parseContentListResult(result.data))
        }
      } catch (error) {
        logError(error.message)
      } finally {
        self.isFetchingFollowedList = false
        self.hasFetchedFollowedList = true
      }
    }),
    fetchMoreFollowedList: flow(function * () {
      self.isFetchingMoreFollowedList = true
      try {
        const lastContent = self.followedList[self.followedList.length - 1]
        const result: ContentListResult = yield self.env.likerLandAPI.fetchReaderFollowing({
          before: lastContent.timestamp,
        })
        switch (result.kind) {
          case "ok":
            const contents = self.parseContentListResult(result.data)
            self.followedList.replace(uniq(self.followedList.concat(contents)))
            if (!contents.length) {
              self.hasReachedEndOfFollowedList = true
            }
        }
      } catch (error) {
        logError(error.message)
      } finally {
        self.isFetchingMoreFollowedList = false
      }
    }),
  }))

type ReaderStoreType = Instance<typeof ReaderStoreModel>
export interface ReaderStore extends ReaderStoreType {}
type ReaderStoreSnapshotType = SnapshotOut<typeof ReaderStoreModel>
export interface ReaderStoreSnapshot extends ReaderStoreSnapshotType {}
