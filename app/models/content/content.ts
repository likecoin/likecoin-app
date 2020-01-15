import {
  flow,
  getParentOfType,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { CreatorModel } from "../creator"
import { withEnvironment } from "../extensions"
import { ReaderStore, ReaderStoreModel } from "../reader-store"
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
  })
  .volatile(() => ({
    hasFetchedDetails: false,
    hasFetchedLikeStats: false,
    isFetchingDetails: false,
    isFetchingLikeStats: false,
  }))
  .extend(withEnvironment)
  .views(self => ({
    get isLoading() {
      return !(self.hasCached || self.hasFetchedDetails) ||
        self.isFetchingDetails ||
        (self.creator && self.creator.isLoading)
    },
    get shouldFetchDetails() {
      return !self.hasFetchedDetails || !self.hasCached
    },
    get shouldFetchCreatorDetails() {
      return self.creator && (
        !self.creator.hasFetchedDetails ||
        !self.creator.hasCached
      )
    },
    get shouldFetchLikeStat() {
      return self.creator && !self.hasFetchedLikeStats
    },
  }))
  .actions(self => ({
    setTimestamp(timestamp: number) {
      if (timestamp) self.timestamp = timestamp
    },
    fetchDetails: flow(function * () {
      self.isFetchingDetails = true
      try {
        const result: ContentResult = yield self.env.likeCoAPI.fetchContentInfo(self.url)
        switch (result.kind) {
          case "ok": {
            const {
              user: likerId,
              description,
              title,
              image,
              like,
            } = result.data
            if (!self.creator) {
              const readerStore: ReaderStore = getParentOfType(self, ReaderStoreModel)
              self.creator = readerStore.createCreatorFromLikerId(likerId)
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
      }
    }),
    fetchLikeStat: flow(function * () {
      self.isFetchingLikeStats = true
      try {
        const result: LikeStatResult = yield self.env.likeCoAPI.fetchContentLikeStat(
          self.creator.likerID,
          self.url
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
      }
    }),
  }))

type ContentType = Instance<typeof ContentModel>
export interface Content extends ContentType {}
type ContentSnapshotType = SnapshotOut<typeof ContentModel>
export interface ContentSnapshot extends ContentSnapshotType {}
