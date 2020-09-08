import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import { partition } from "ramda"

import {
  ContentModel,
} from "../content"
import { CreatorModel } from "../creator"
import { withEnvironment } from "../extensions"
import {
  SuperLikeModel,
  SuperLikesGroupedByDay,
} from "../super-like"

import {
  BookmarkListResult,
  ContentListResult,
  Content as ContentResultData,
  GeneralResult,
  ReaderCreatorsResult,
} from "../../services/api/api.types"
import * as LikerLandTypes from "../../services/api/likerland-api.types"
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
    followedList: ContentList,
    bookmarkList: ContentList,
    followingCreators: types.array(types.safeReference(CreatorModel)),
    unfollowedCreators: types.array(types.safeReference(CreatorModel)),
  })
  .postProcessSnapshot(snapshot => {
    const { bookmarkList } = snapshot
    const toBePersistedContentURLs = new Set(
      [].concat(bookmarkList, snapshot.followedList.slice(0, 20)),
    )
    const [toBePersistedContents, restContents] = partition(
      c => toBePersistedContentURLs.has(c.url),
      Object.values(snapshot.contents),
    )
    const contents = {}
    const creators = {}
    restContents
      .sort((a, b) => b.timestamp - a.timestamp)
      // Cache 1,000 contents at max and
      .slice(0, 1000)
      // Cache preferred contents
      .concat(toBePersistedContents)
      .forEach(content => {
        contents[content.url] = content
        if (snapshot.creators[content.creator]) {
          creators[content.creator] = snapshot.creators[content.creator]
        }
      })
    return {
      contents,
      creators,
      bookmarkList,
    }
  })
  .volatile(() => ({
    isFetchingCreatorList: false,
    hasFetchedCreatorList: false,
    isFetchingFollowedList: false,
    hasFetchedFollowedList: false,
    followedListLastFetchedDate: new Date(),
    isFetchingMoreFollowedList: false,
    hasReachedEndOfFollowedList: false,
    followedSet: new Set<string>(),
    followingSuperLikePages: {} as SuperLikesGroupedByDay,
    isFetchingBookmarkList: false,
    hasFetchedBookmarkList: false,
  }))
  .extend(withEnvironment)
  .views(self => ({
    getShouldRefreshFollowingFeed() {
      return (
        Date.now() - self.followedListLastFetchedDate.getTime() >=
        parseInt(self.getConfig("READING_FEED_RESUME_REFRESH_DEBOUNCE")) * 1000
      )
    },
  }))
  .actions(self => ({
    reset() {
      self.followedList.replace([])
      self.bookmarkList.replace([])
      self.followingCreators.replace([])
      self.unfollowedCreators.replace([])
      self.isFetchingCreatorList = false
      self.hasFetchedCreatorList = false
      self.isFetchingFollowedList = false
      self.hasFetchedFollowedList = false
      self.followedListLastFetchedDate = new Date()
      self.isFetchingMoreFollowedList = false
      self.hasReachedEndOfFollowedList = false
      self.followedSet = new Set<string>()
      self.followingSuperLikePages = {} as SuperLikesGroupedByDay
      self.isFetchingBookmarkList = false
      self.hasFetchedBookmarkList = false
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
    parseSuperLikeFeedItemToModel({
      superLikeID,
      url,
      referrer,
      liker,
      user: likee,
      ts,
    }: LikerLandTypes.SuperLikeFeedItem) {
      const superLike = SuperLikeModel.create({
        id: superLikeID,
        timestamp: ts,
      }, self.env)

      superLike.addLiker(this.createCreatorFromLikerId(liker))

      // Find content reference for this Super Like
      const contentURL = referrer || url
      let content = self.contents.get(contentURL)
      if (!content) {
        content = ContentModel.create({ url: contentURL, timestamp: ts })
        self.contents.put(content)
        if (likee) {
          content.creator = this.createCreatorFromLikerId(likee)
        }
      }

      superLike.setContent(content)

      return superLike
    },
    getContentByURL(url: string) {
      if (url) {
        return this.parseContentResult({ url })
      }
      return undefined
    },
  }))
  .actions(self => ({
    fetchCreatorList: flow(function * () {
      if (self.isFetchingCreatorList) return
      self.isFetchingCreatorList = true
      try {
        const result: ReaderCreatorsResult = yield self.env.likerLandAPI.fetchReaderCreators()
        switch (result.kind) {
          case "ok":
            self.followingCreators.replace([])
            result.following.forEach(likerID => {
              const creator = self.createCreatorFromLikerId(likerID)
              creator.isFollowing = true
              self.followingCreators.push(creator)
            })
            self.unfollowedCreators.replace([])
            result.unfollowed.forEach(likerID => {
              const creator = self.createCreatorFromLikerId(likerID)
              creator.isFollowing = false
              self.unfollowedCreators.push(creator)
            })
        }
      } catch (error) {
        logError(error.message)
      } finally {
        self.isFetchingCreatorList = false
        self.hasFetchedCreatorList = true
      }
    }),
    fetchFollowingList: flow(function * () {
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
    fetchBookmarkList: flow(function * () {
      if (self.isFetchingBookmarkList) return
      self.isFetchingBookmarkList = true
      try {
        const result: BookmarkListResult = yield self.env.likerLandAPI.fetchReaderBookmark()
        switch (result.kind) {
          case "ok":
            self.bookmarkList.replace([])
            result.data.reverse().forEach(url => {
              const bookmark = self.parseContentResult({ url })
              bookmark.isBookmarked = true
              self.bookmarkList.push(bookmark)
            })
        }
      } catch (error) {
        logError(error.message)
      } finally {
        self.isFetchingBookmarkList = false
        self.hasFetchedBookmarkList = true
      }
    }),
    toggleBookmark: flow(function * (url: string) {
      const content = self.contents.get(url)
      if (!content) return
      const prevIsBookmarked = content.isBookmarked
      const prevBookmarkList = self.bookmarkList
      content.isBookmarked = !content.isBookmarked
      try {
        if (content.isBookmarked) {
          self.bookmarkList.splice(0, 0, content)
          const result: GeneralResult = yield self.env.likerLandAPI.addBookmark(content.url)
          if (result.kind !== "ok") {
            throw new Error("READER_BOOKMARK_ADD_FAILED")
          }
        } else {
          self.bookmarkList.remove(content)
          const result: GeneralResult = yield self.env.likerLandAPI.removeBookmark(content.url)
          if (result.kind !== "ok") {
            throw new Error("READER_BOOKMARK_REMOVE_FAILED")
          }
        }
      } catch (error) {
        logError(error.message)
        content.isBookmarked = prevIsBookmarked
        self.bookmarkList.replace(prevBookmarkList)
      }
    }),
    toggleFollow: flow(function * (likerID: string) {
      const creator = self.creators.get(likerID)
      if (!creator) return
      const prevIsFollow = creator.isFollowing
      const prevFollowingCreators = self.followingCreators
      const prevUnfollowedCreators = self.unfollowedCreators
      creator.isFollowing = !creator.isFollowing

      try {
        if (creator.isFollowing) {
          self.unfollowedCreators.remove(creator)
          self.followingCreators.push(creator)
          const result: GeneralResult = yield self.env.likerLandAPI.followLiker(likerID)
          if (result.kind !== "ok") {
            throw new Error("READER_FOLLOW_FAILED")
          }
        } else {
          self.followingCreators.remove(creator)
          self.unfollowedCreators.push(creator)
          const result: GeneralResult = yield self.env.likerLandAPI.unfollowLiker(likerID)
          if (result.kind !== "ok") {
            throw new Error("READER_UNFOLLOW_FAILED")
          }
        }
      } catch (error) {
        logError(error.message)
        creator.isFollowing = prevIsFollow
        self.followingCreators.replace(prevFollowingCreators)
        self.unfollowedCreators.replace(prevUnfollowedCreators)
      }
    }),
  }))

type ReaderStoreType = Instance<typeof ReaderStoreModel>
export interface ReaderStore extends ReaderStoreType {}
type ReaderStoreSnapshotType = SnapshotOut<typeof ReaderStoreModel>
export interface ReaderStoreSnapshot extends ReaderStoreSnapshotType {}
