import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { withEnvironment } from "../extensions"
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
    creatorLikerID: types.maybe(types.string),
    likeCount: types.optional(types.integer, 0),
    likerCount: types.optional(types.integer, 0),
    timestamp: types.maybe(types.integer),
    isFetchingDetails: types.optional(types.boolean, false),
    hasFetchedDetails: types.optional(types.boolean, false),
  })
  .extend(withEnvironment)
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
              user,
              description,
              title,
              image,
              like,
            } = result.data
            self.creatorLikerID = user
            self.description = description
            self.title = title
            self.imageURL = image
            if (self.likeCount < like) {
              self.likeCount = like
            }
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
      try {
        const result: LikeStatResult = yield self.env.likeCoAPI.fetchContentLikeStat(
          self.creatorLikerID,
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
      }
    }),
  }))

type ContentType = Instance<typeof ContentModel>
export interface Content extends ContentType {}
type ContentSnapshotType = SnapshotOut<typeof ContentModel>
export interface ContentSnapshot extends ContentSnapshotType {}
