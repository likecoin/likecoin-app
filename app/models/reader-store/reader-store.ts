import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { ContentModel } from "../content"
import { CreatorModel } from "../creator"
import { withEnvironment } from "../extensions"

import { ContentListResult, Content as ContentResultData } from "../../services/api/api.types"
import { logError } from "../../utils/error"

const ContentList = types.array(types.safeReference(types.late(() => ContentModel)))

/**
 * Store all content related information.
 */
export const ReaderStoreModel = types
  .model("ReaderStore")
  .props({
    contents: types.map(types.late(() => ContentModel)),
    creators: types.map(types.late(() => CreatorModel)),
    featuredList: ContentList,
    featuredListLastFetchedDate: types.optional(types.Date, () => new Date(0)),
    followedList: ContentList,
  })
  .volatile(() => ({
    isFetchingFeaturedList: false,
    hasFetchedFeaturedList: false,
    isFetchingFollowedList: false,
    hasFetchedFollowedList: false,
    followedListLastFetchedDate: new Date(),
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
      self.hasFetchedFeaturedList = false
      self.featuredListLastFetchedDate = new Date(0)
      self.followedList.replace([])
      self.hasFetchedFollowedList = false
      self.hasReachedEndOfFollowedList = false
      self.followedSet = new Set<string>()
    },
    createCreatorFromLikerId(likerId: string) {
      let creator = self.creators.get(likerId)
      if (!creator) {
        creator = CreatorModel.create({ likerID: likerId }, self.env)
        self.creators.put(creator)
      }
      return creator
    },
    createContentFromContentResultData(data: ContentResultData) {
      const {
        image: imageURL,
        ts: timestamp,
        like: likeCount,
        referrer,
        url,
        user: likerId,
        ...rest
      } = data
      const content = ContentModel.create({
        url: referrer || url,
        imageURL,
        timestamp,
        likeCount,
        ...rest
      })
      self.contents.put(content)
      if (likerId) {
        content.creator = this.createCreatorFromLikerId(likerId)
      }
      return content
    },
    parseContentResult(data: ContentResultData) {
      let content = self.contents.get(data.referrer || data.url)
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
      self.isFetchingFeaturedList = true
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
        self.isFetchingFeaturedList = false
        self.hasFetchedFeaturedList = true
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
        self.followedListLastFetchedDate = new Date()
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
