import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { Content, ContentModel } from "../content"
import { withEnvironment } from "../extensions"

import { ContentListResult, Content as ContentResultData } from "../../services/api/api.types"
import { logError } from "../../utils/error"

const ContentList = types.array(types.safeReference(ContentModel))

export function sortContentForSnapshot(a: Content, b: Content) {
  return b.timestamp - a.timestamp
}

/**
 * Store all content related information.
 */
export const ReaderStoreModel = types
  .model("ReaderStore")
  .props({
    contents: types.map(ContentModel),
    featuredList: ContentList,
    featuredListLastFetchedDate: types.optional(types.Date, () => new Date(0)),
    followedList: ContentList,
  })
  .volatile(() => ({
    isFetchingSuggestList: false,
    hasFetchedSuggestList: false,
    isFetchingFollowedList: false,
    hasFetchedFollowedList: false,
    isFetchingMoreFollowedList: false,
    hasReachedEndOfFollowedList: false,
    followedSet: new Set<string>(),
  }))
  .extend(withEnvironment)
  .views(self => ({
    getHasSeenFeaturedListToday() {
      const past = self.featuredListLastFetchedDate
      const now = new Date()
      return past.getFullYear() === now.getFullYear() &&
        past.getMonth() === now.getMonth() &&
        past.getDate() === now.getDate()
    },
  }))
  .actions(self => ({
    clearAllLists: () => {
      self.featuredList.replace([])
      self.hasFetchedSuggestList = false
      self.featuredListLastFetchedDate = new Date(0)
      self.followedList.replace([])
      self.hasFetchedFollowedList = false
    },
    createContentFromContentResultData(data: ContentResultData) {
      const {
        referrer: url,
        image: imageURL,
        ts: timestamp,
        like: likeCount,
        user: creatorLikerID,
        ...rest
      } = data
      const content = ContentModel.create({
        url,
        imageURL,
        timestamp,
        likeCount,
        creatorLikerID,
        ...rest
      })
      self.contents.put(content)
      return content
    },
    parseContentResult(data: ContentResultData) {
      let content = self.contents.get(data.url || data.referrer)
      if (!content) {
        content = this.createContentFromContentResultData(data)
      }
      content.setTimestamp(data.ts)
      return content
    },
    handleFollowedContentResultData(data: ContentResultData) {
      const content = this.parseContentResult(data)
      if (!self.followedSet.has(content.url)) {
        self.followedSet.add(content.url)
        self.followedList.push(content)
      }
    },
    getContentByURL(url: string) {
      return this.parseContentResult({ url })
    },
  }))
  .actions(self => ({
    fetchSuggestList: flow(function * () {
      self.isFetchingSuggestList = true
      try {
        const result: ContentListResult = yield self.env.likerLandAPI.fetchReaderSuggest()
        switch (result.kind) {
          case "ok":
            self.featuredList.replace([])
            result.data.forEach((data) => {
              self.featuredList.push(self.parseContentResult(data))
            })
        }
      } catch (error) {
        logError(error.message)
      } finally {
        self.isFetchingSuggestList = false
        self.hasFetchedSuggestList = true
        self.featuredListLastFetchedDate = new Date()
      }
    }),
    fetchFollowedList: flow(function * () {
      self.isFetchingFollowedList = true
      try {
        const result: ContentListResult = yield self.env.likerLandAPI.fetchReaderFollowing()
        switch (result.kind) {
          case "ok":
            self.followedSet = new Set()
            self.followedList.replace([])
            result.data.forEach(self.handleFollowedContentResultData)
        }
      } catch (error) {
        logError(error.message)
      } finally {
        self.isFetchingFollowedList = false
        self.hasFetchedFollowedList = true
        self.hasReachedEndOfFollowedList = false
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
            result.data.forEach(self.handleFollowedContentResultData)
            if (!result.data.length) {
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
