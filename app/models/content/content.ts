import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import { Creator, CreatorModel } from "../creator"
import {
  withCreatorsStore,
  withCurrentUser,
  withEnvironment,
} from "../extensions"
import { ContentResult, LikeStatResult } from "../../services/api"
import { logError } from "../../utils/error"

/**
 * Likeable Content
 */
export const ContentModel = types
  .model("Content")
  .props({
    url: types.identifier,
    title: types.maybe(types.string),
    description: types.maybe(types.string),
    imageURL: types.maybe(types.string),
    /**
     * Deprecated. Use `creator.likerID` instead.
     */
    creatorLikerID: types.undefined,
    creator: types.maybe(types.safeReference(types.late(() => CreatorModel))),
    likeCount: types.optional(types.integer, 0),
    likerCount: types.optional(types.integer, 0),
    timestamp: types.optional(types.integer, 0),

    hasCached: types.optional(types.boolean, false),

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
    hasFetchedDetails: false,
    hasFetchedLikeStats: false,
    isBookmarked: false,
    isFetchingDetails: false,
    isFetchingLikeStats: false,
  }))
  .extend(withCreatorsStore)
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
        (!self.hasCached && (!self.hasFetchedDetails || self.isFetchingDetails)) ||
        (self.creator && self.creator.isLoading)
      )
    },
    get shouldFetchDetails() {
      return !self.hasFetchedDetails || !self.hasCached
    },
    get shouldFetchCreatorDetails() {
      return self.creator && !self.creator.hasFetchedDetails
    },
    get shouldFetchLikeStat() {
      return self.creator && !self.hasFetchedLikeStats
    },
    get creatorDisplayName() {
      return self.creator?.normalizedName || ""
    },
    get normalizedTitle() {
      return self.title || decodeURI(self.url).split("?")[0]
    },
    hasRead() {
      return !!self.readUsers.get(self.currentUserID)
    },
  }))
  .actions(self => {
    function updateLastFetchedAt() {
      const now = Date.now()
      if (now > self.lastFetchedAt) {
        self.lastFetchedAt = now
      }
    }

    return {
      setTimestamp(timestamp: number) {
        if (timestamp) self.timestamp = timestamp
      },
      setCreator(creator: Creator) {
        self.creator = creator
      },
      setIsBookmark(value: boolean) {
        self.isBookmarked = value
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
              self.hasCached = true
            }
          }
        } catch (error) {
          logError(error.message)
        } finally {
          self.isFetchingDetails = false
          self.hasFetchedDetails = true
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
          self.hasFetchedLikeStats = true
          updateLastFetchedAt()
        }
      }),
    }
  })

type ContentType = Instance<typeof ContentModel>
export interface Content extends ContentType {}
type ContentSnapshotType = SnapshotOut<typeof ContentModel>
export interface ContentSnapshot extends ContentSnapshotType {}
