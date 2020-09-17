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
import { withEnvironment, withCreatorsStore } from "../extensions"
import {
  SuperLikeModel,
  SuperLikesGroupedByDay,
} from "../super-like"

import {
  BookmarkListResult,
  ContentListResult,
  Content as ContentResultData,
  GeneralResult,
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
    followedList: ContentList,
    bookmarkList: ContentList,
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
    restContents
      .sort((a, b) => b.timestamp - a.timestamp)
      // Cache 1,000 contents at max and
      .slice(0, 1000)
      // Cache preferred contents
      .concat(toBePersistedContents)
      .forEach(content => {
        contents[content.url] = content
      })
    return {
      contents,
      bookmarkList,
    }
  })
  .volatile(() => ({
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
  .extend(withCreatorsStore)
  .views(self => ({
    getShouldRefreshFollowingFeed() {
      return (
        Date.now() - self.followedListLastFetchedDate.getTime() >=
        parseInt(self.getConfig("READING_FEED_RESUME_REFRESH_DEBOUNCE")) * 1000
      )
    },
    get creators() {
      return self.creatorsStore.creators
    },
  }))
  .actions(self => ({
    reset() {
      self.followedList.replace([])
      self.bookmarkList.replace([])
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
        content.creator = self.createCreatorFromLikerID(likerId)
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
      if (url) {
        return this.parseContentResult({ url })
      }
      return undefined
    },
  }))
  /**
   * Action for parsing Super Like feed item
   */
  .actions(self => {
    /**
     * Deserialize Super Like feed item response to model
     * @param item Serialized Super Like feed item 
     * @param options Optional extra options for creating model
     * @return A Super Like model
     */
    function parseSuperLikeFeedItemToModel(
      {
        superLikeID,
        superLikeShortID,
        url,
        referrer,
        liker,
        user: likee,
        ts,
      }: LikerLandTypes.SuperLikeFeedItem,
      options: {
        isFollowing?: boolean
      } = {}
    ) {
      const superLike = SuperLikeModel.create({
        id: superLikeID,
        shortId: superLikeShortID,
        timestamp: ts,
      }, self.env)

      const superLiker = self.createCreatorFromLikerID(liker, {
        isFollowing: options.isFollowing,
      })
      superLike.addLiker(superLiker)

      // Find content reference for this Super Like
      const contentURL = referrer || url
      let content = self.contents.get(contentURL)
      if (!content) {
        content = ContentModel.create({ url: contentURL, timestamp: ts })
        self.contents.put(content)
        if (likee) {
          content.creator = self.createCreatorFromLikerID(likee)
        }
      }

      superLike.setContent(content)

      return superLike
    }

    return {
      parseSuperLikeFeedItemToModel,
      parseSuperLikeFollowingFeedItemToModel(item: LikerLandTypes.SuperLikeFeedItem) {
        return parseSuperLikeFeedItemToModel(item, { isFollowing: true })
      },
    }
  })
  .actions(self => ({
    fetchCreatorList: flow(function * () {
      yield self.creatorsStore.fetchCreators()
    }),
    fetchFollowingList: flow(function * () {
      self.creatorsStore.fetchCreators()
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
  }))

type ReaderStoreType = Instance<typeof ReaderStoreModel>
export interface ReaderStore extends ReaderStoreType {}
type ReaderStoreSnapshotType = SnapshotOut<typeof ReaderStoreModel>
export interface ReaderStoreSnapshot extends ReaderStoreSnapshotType {}
