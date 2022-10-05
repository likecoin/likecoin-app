import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import { logError } from "../../utils/error"
import { SuperLikeFeedResult } from "../../services/api/api.types"

import { SuperLike } from "../super-like"
import { SuperLikeFeedModel } from "../super-like-feed"

/**
 * Store for global Super Likes.
 */
export const SuperLikeGlobalStoreModel = SuperLikeFeedModel.named(
  "SuperLikeGlobalStore",
)
  .props({
    lastFetchedTimestamp: types.maybe(types.number),
  })
  .actions(self => {
    const MAX_ITEMS_COUNT = self.getNumericConfig(
      "MAX_GLOBAL_SUPERLIKE_FEED_ITEM",
    )
    const ITEMS_LIMIT_PER_FETCH = 7

    const fetch = flow(function*() {
      if (self.status === "pending") return
      self.setStatus("pending")
      try {
        const result: SuperLikeFeedResult = yield self.env.likeCoinAPI.like.share.latest(
          {
            limit: ITEMS_LIMIT_PER_FETCH,
          },
        )
        if (result.kind === "ok") {
          const superLikes: SuperLike[] = []
          result.data.forEach(data => {
            superLikes.push(
              self.createSuperLikeFeedItemFromData(data),
            )
          })
          self.items.replace(superLikes)
        }
      } catch (error) {
        logError(error)
      } finally {
        self.setStatus("done")
        self.lastFetchedTimestamp = Date.now()
      }
    })

    const fetchMore = flow(function*() {
      if (["pending-more", "pending", "idle"].includes(self.status)) return
      self.setStatus("pending-more")
      try {
        const result: SuperLikeFeedResult = yield self.env.likeCoinAPI.like.share.latest(
          {
            before: self.items[self.items.length - 1].timestamp - 1,
            limit: ITEMS_LIMIT_PER_FETCH,
          },
        )
        if (result.kind === "ok") {
          let superLikes: SuperLike[] = []
          result.data.forEach(data => {
            superLikes.push(
              self.createSuperLikeFeedItemFromData(data),
            )
          })

          if (superLikes.length) {
            if (self.items.length + superLikes.length > MAX_ITEMS_COUNT) {
              const itemCountLeft = MAX_ITEMS_COUNT - self.items.length
              superLikes = superLikes.splice(
                superLikes.length - itemCountLeft,
                itemCountLeft,
              )
            }
            if (superLikes.length < ITEMS_LIMIT_PER_FETCH) {
              self.setStatus("done-more")
            } else {
              self.setStatus("done")
            }
            self.items.push(...superLikes)
          } else {
            self.setStatus("done-more")
          }
        }
      } catch (error) {
        logError(error.message)
      } finally {
        if (self.status !== "done-more") {
          self.setStatus("done")
        }
        self.lastFetchedTimestamp = Date.now()
      }
    })

    return {
      fetch,
      fetchMore,
    }
  })

type SuperLikeGlobalStoreType = Instance<typeof SuperLikeGlobalStoreModel>
export interface SuperLikeGlobalStore extends SuperLikeGlobalStoreType {}
type SuperLikeGlobalStoreSnapshotType = SnapshotOut<
  typeof SuperLikeGlobalStoreModel
>
export interface SuperLikeGlobalStoreSnapshot
  extends SuperLikeGlobalStoreSnapshotType {}
