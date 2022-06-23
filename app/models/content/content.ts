import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import {
  BookmarkAddResult,
  ContentResult,
  CurrentUserContentLikeStatResult,
  CurrentUserContentSuperLikeStatResult,
  GeneralResult,
  LikeStatResult,
} from "../../services/api"
import { logError } from "../../utils/error"

import { Creator, CreatorModel } from "../creator"
import {
  withCreatorsStore,
  withContentBookmarksStore,
  withCurrentUser,
  withEnvironment,
} from "../extensions"

/**
 * Likeable Content
 */
export const ContentModel = types
  .model("Content")
  .props({
    url: types.identifier,
    iscnId: types.maybe(types.string),
    title: types.maybe(types.string),
    description: types.maybe(types.string),
    imageURL: types.maybe(types.string),
    /**
     * @deprecated
     * Use `creator.likerID` instead.
     */
    creatorLikerID: types.undefined,
    creator: types.maybe(types.safeReference(types.late(() => CreatorModel))),
    likeCount: types.optional(types.integer, 0),
    likerCount: types.optional(types.integer, 0),

    readUsers: types.map(types.number),

    lastFetchedAt: types.maybe(types.number),
  })
  .postProcessSnapshot(({ readUsers, ...restSnapshot }) => ({
    // Store last 5 users only
    readUsers: Object.keys(readUsers)
      .sort((aID, bID) => readUsers[bID] - readUsers[aID])
      .slice(0, 5)
      .reduce((acc, id) => {
        acc[id] = readUsers[id]
        return acc
      }, {}),
    ...restSnapshot,
  }))
  .volatile(() => ({
    currentUserLikeCount: 0,
    isCurrentUserSuperLiker: false,
    canCurrentUserSuperLike: false,
    hasCurrentUserSuperLiked: false,
    currentUserSuperLikeCooldown: 0,
    currentUserSuperLikeCooldownEndTime: 0,

    isFetchingDetails: false,
    isFetchingLikeStats: false,
    isUpdatingBookmark: false,
    isUpdatingBookmarkArchive: false,
  }))
  .extend(withCreatorsStore)
  .extend(withContentBookmarksStore)
  .extend(withCurrentUser)
  .extend(withEnvironment)
  .views(self => ({
    get coverImageURL() {
      return self.imageURL ? encodeURI(decodeURI(self.imageURL)) : undefined
    },
    get isFollowingCreator() {
      return self.creator && self.creator.isFollowing
    },
    get isLoading() {
      return (
        self.lastFetchedAt === undefined ||
        self.isFetchingDetails ||
        !!self.creator?.isLoading
      )
    },
    checkShouldFetchDetails() {
      return (
        !self.creator ||
        self.lastFetchedAt === undefined ||
        Date.now() - self.lastFetchedAt >
          self.getNumericConfig("META_FETCHING_INTERVAL") * 1000
      )
    },
    checkShouldFetchCreatorDetails() {
      return self.creator && self.creator.checkShouldFetchDetails()
    },
    get creatorDisplayName() {
      return self.creator?.normalizedName || ""
    },
    get normalizedTitle() {
      let url = ''
      if (self.title) return self.title
      try {
        url = decodeURI(self.url).split("?")[0]
      } catch (error) {
        logError(error)
      }
      return url
    },
    hasRead() {
      return !!self.readUsers.get(self.currentUserID)
    },
    get bookmark() {
      return self.getBookmarkByURL(self.url)
    },
    get isBookmarked() {
      return self.checkIsBookmarkedURL(self.url)
    },
    get isArchived() {
      return !!this.bookmark?.isArchived
    },
    get bookmarkedTimestamp() {
      return this.bookmark?.timestamp
    },
  }))
  .actions(self => {
    function updateLastFetchedAt() {
      const now = Date.now()
      if (self.lastFetchedAt === undefined || now > self.lastFetchedAt) {
        self.lastFetchedAt = now
      }
    }

    const fetchCurrentUserSuperLikeStat = flow(function*() {
      try {
        const result: CurrentUserContentSuperLikeStatResult =
          yield self.env.likeCoinAPI.like.share.self(self.url)
        if (result.kind === "ok") {
          const {
            isSuperLiker,
            canSuperLike,
            nextSuperLikeTs,
            lastSuperLikeInfos,
            cooldown,
          } = result.data
          self.isCurrentUserSuperLiker = isSuperLiker
          self.canCurrentUserSuperLike = canSuperLike
          /**
           * HACK: Assume if `hasSuperLiked` has set to `true`, don't override it as
           * `lastSuperLikeInfos` may return empty array even the Super Like action is success
           */
          if (!self.hasCurrentUserSuperLiked) {
            self.hasCurrentUserSuperLiked = !!lastSuperLikeInfos?.length;
          }
          self.currentUserSuperLikeCooldownEndTime = nextSuperLikeTs
          self.currentUserSuperLikeCooldown = cooldown
        }
      } catch (error) {
        logError(error.message)
      } finally {
        updateLastFetchedAt()
      }
    })

    return {
      setCreator(creator: Creator) {
        self.creator = creator
      },
      read() {
        if (self.currentUser) {
          self.readUsers.set(self.currentUserID, Date.now())
        }
      },
      fetchDetails: flow(function*() {
        self.isFetchingDetails = true
        try {
          const result: ContentResult = yield self.env.likeCoAPI.fetchContentInfo(
            self.url,
            self.iscnId,
          )
          switch (result.kind) {
            case "ok": {
              const {
                user: likerId,
                description,
                title,
                image,
                like,
              } = result.data
              if (!self.creator && likerId) {
                self.creator = self.createCreatorFromLikerID(likerId)
              }
              self.description = description
              self.title = title
              self.imageURL = image
              if (self.likeCount < like) {
                self.likeCount = like
              }
            }
          }
        } catch (error) {
          logError(error)
        } finally {
          self.isFetchingDetails = false
          updateLastFetchedAt()
        }
      }),
      fetchLikeStat: flow(function*() {
        if (!self.creator) return
        self.isFetchingLikeStats = true
        try {
          const result: LikeStatResult = yield self.env.likeCoAPI.fetchContentLikeStat(
            self.creator.likerID,
            self.url,
          )
          switch (result.kind) {
            case "ok": {
              const { total, totalLiker } = result.data
              if (self.likeCount < total) {
                self.likeCount = total
              }
              self.likerCount = totalLiker
            }
          }
        } catch (error) {
          logError(error.message)
        } finally {
          self.isFetchingLikeStats = false
          updateLastFetchedAt()
        }
      }),
      fetchCurrentUserLikeStat: flow(function*() {
        try {
          const result: CurrentUserContentLikeStatResult =
            yield self.env.likeCoinAPI.like.self({
              id: self.creator.likerID,
              url: self.url,
            })
          if (result.kind === "ok") {
            self.currentUserLikeCount = result.data.count
          }
        } catch (error) {
          logError(error.message)
        } finally {
          updateLastFetchedAt()
        }
      }), 
      fetchCurrentUserSuperLikeStat,
      like: flow(function*(hits = 1) {
        try {
          const response: GeneralResult = yield self.env.likeCoinAPI.like.post({
            id: self.creator.likerID,
            url: self.url,
            count: hits,
          })
          if (response.kind === "ok") {
            self.currentUserLikeCount += hits
          }
        } catch (error) {
          logError(error)
        }
      }),
      superLike: flow(function*() {
        const prevCooldown = self.currentUserSuperLikeCooldown
        const prevHasSuperLiked = self.hasCurrentUserSuperLiked
        self.hasCurrentUserSuperLiked = true
        self.canCurrentUserSuperLike = false
        self.currentUserSuperLikeCooldown = 1
        try {
          yield self.env.likeCoinAPI.like.share.post({
            id: self.creator.likerID,
            url: self.url,
          })
        } catch (error) {
          self.hasCurrentUserSuperLiked = prevHasSuperLiked
          self.canCurrentUserSuperLike = true
          self.currentUserSuperLikeCooldown = prevCooldown
          logError(error)
        } finally {
          yield fetchCurrentUserSuperLikeStat()
        }
      }),
      addBookmark: flow(function*() {
        if (self.isUpdatingBookmark || self.isBookmarked) return
        self.isUpdatingBookmark = true
        try {
          const response: BookmarkAddResult = yield self.env.likeCoinAPI.users.bookmarks.add(
            self.url,
          )
          if (response.kind === "ok") {
            const id = response.data
            self.contentBookmarksStore.add({
              id,
              url: self.url,
              timestamp: Date.now(),
            })
          }
        } catch (error) {
          logError(error)
        } finally {
          self.isUpdatingBookmark = false
        }
      }),
      removeBookmark: flow(function*() {
        if (self.isUpdatingBookmark || !self.isBookmarked) return
        self.isUpdatingBookmark = true
        try {
          const response: BookmarkAddResult = yield self.env.likeCoinAPI.users.bookmarks.remove(
            self.url,
          )
          if (response.kind === "ok") {
            self.contentBookmarksStore.remove(self.url)
          }
        } catch (error) {
          logError(error)
        } finally {
          self.isUpdatingBookmark = false
        }
      }),
      archiveBookmark: flow(function*() {
        if (
          self.isUpdatingBookmarkArchive ||
          !self.isBookmarked ||
          self.isArchived
        ) {
          return
        }
        self.isUpdatingBookmarkArchive = true
        try {
          const response: GeneralResult = yield self.env.likeCoinAPI.users.bookmarks.archive(
            self.bookmark.id,
          )
          if (response.kind === "ok") {
            self.updateBookmarkIsArchived(self.url, true)
          }
        } catch (error) {
          logError(error)
        } finally {
          self.isUpdatingBookmarkArchive = false
        }
      }),
      unarchiveBookmark: flow(function*() {
        if (
          self.isUpdatingBookmarkArchive ||
          !self.isBookmarked ||
          !self.isArchived
        ) {
          return
        }
        self.isUpdatingBookmarkArchive = true
        try {
          const response: GeneralResult = yield self.env.likeCoinAPI.users.bookmarks.unarchive(
            self.bookmark.id,
          )
          if (response.kind === "ok") {
            self.updateBookmarkIsArchived(self.url, false)
          }
        } catch (error) {
          logError(error)
        } finally {
          self.isUpdatingBookmarkArchive = false
        }
      }),
    }
  })

type ContentType = Instance<typeof ContentModel>
export interface Content extends ContentType {}
type ContentSnapshotType = SnapshotOut<typeof ContentModel>
export interface ContentSnapshot extends ContentSnapshotType {}
