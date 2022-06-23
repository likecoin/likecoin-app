import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { SuperLikeFeedItem, SuperLikeFeedResult } from "../../services/api/likerland-api.types"
import { logError } from "../../utils/error"

import { withCurrentUser } from "../extensions"
import { SuperLike } from "../super-like"
import { SuperLikeFeedModel } from "../super-like-feed"

/**
 * Store for Super Like feed from following creators.
 */
export const MySuperLikeFeedStoreModel = SuperLikeFeedModel
  .named("MySuperLikeFeedStore")
  .props({
    lastFetchedTimestamp: types.maybe(types.number),
  })
  .extend(withCurrentUser)
  .actions(self => {
    const ITEMS_LIMIT_PER_FETCH = 7

    function reset() {
      self.items.replace([])
    }

    function createSuperLikeFollowingFeedItemFromData(item: SuperLikeFeedItem) {
      return self.createSuperLikeFeedItemFromData(item, { isFollowing: true })
    }

    function removeDuplicatedFeedItems(items: SuperLike[]) {
      const urlIndexMap: { [key: string]: number } = {}
      const newItems: SuperLike[] = []
      try {
        for (let i = items.length - 1; i >= 0; i--) {
          const item = items[i]
          const url = item.content.url
          const index = urlIndexMap[url]
          if (index !== undefined) {
            newItems[index].addLiker(item.liker)
          } else {
            urlIndexMap[url] = newItems.push(items[i]) - 1
          }
        }
      } catch (error) {
        logError(error)
        return items
      }
      return newItems.reverse()
    }

    const fetch = flow(function*() {
      if (self.status === "pending") return
      self.setStatus("pending")
      try {
        const result: SuperLikeFeedResult =
          yield self.env.likerLandAPI.fetchReaderSuperLikeSelfFeed(
            {
              likerId: self.currentUserID,
              limit: ITEMS_LIMIT_PER_FETCH,
            },
          )
        if (result.kind === "ok") {
          const resultData = result.data || []
          if (resultData.length) {
            const items = result.data.map(createSuperLikeFollowingFeedItemFromData)

            self.items.replace(items) // HACK: For getting identifier references
            self.items.replace(removeDuplicatedFeedItems(self.items))
          }
          self.setStatus("done")
        } else {
          self.setStatus("error")
        }
      } catch (error) {
        logError(error)
        self.setStatus("error")
      } finally {
        self.lastFetchedTimestamp = Date.now()
      }
    })

    const fetchMore = flow(function*() {
      if (["pending-more", "pending", "idle"].includes(self.status)) return

      self.setStatus("pending-more")
      try {
        const result: SuperLikeFeedResult =
          yield self.env.likerLandAPI.fetchReaderSuperLikeSelfFeed(
            {
              likerId: self.currentUserID,
              before: self.items[self.items.length - 1].timestamp - 1,
              limit: ITEMS_LIMIT_PER_FETCH,
            },
          )
        if (result.kind === "ok") {
          const resultData = result.data || []
          if (resultData.length) {
            const items = resultData.map(createSuperLikeFollowingFeedItemFromData)
            if (items.length < ITEMS_LIMIT_PER_FETCH) {
              self.setStatus("done-more")
            } else {
              self.setStatus("done")
            }
            self.items.push(...items)
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
      reset,
      fetch,
      fetchMore,
    }
  })

type MySuperLikeFeedStoreType = Instance<typeof MySuperLikeFeedStoreModel>
export interface MySuperLikeFeedStore extends MySuperLikeFeedStoreType {}
type MySuperLikeFeedStoreSnapshotType = SnapshotOut<
  typeof MySuperLikeFeedStoreModel
>
export interface MySuperLikeFeedStoreSnapshot
  extends MySuperLikeFeedStoreSnapshotType {}
