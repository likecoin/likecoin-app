import { Instance, SnapshotOut, types, flow, getEnv } from "mobx-state-tree"

import { Environment } from "../environment"
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
  .actions(self => ({
    fetchDetails: flow(function * () {
      const env: Environment = getEnv(self)
      self.isFetchingDetails = true
      try {
        const result: ContentResult = yield env.likeCoAPI.fetchContentInfo(self.url)
        switch (result.kind) {
          case "ok": {
            const {
              user,
              description,
              title,
              image,
              like,
              ts,
            } = result.data
            self.creatorLikerID = user
            self.description = description
            self.title = title
            self.imageURL = image
            if (self.likeCount < like) {
              self.likeCount = like
            }
            self.timestamp = ts
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
      const env: Environment = getEnv(self)
      try {
        const result: LikeStatResult = yield env.likeCoAPI.fetchContentLikeStat(
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
