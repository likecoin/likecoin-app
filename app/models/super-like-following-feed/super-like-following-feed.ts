import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import {
  SuperLikeFeedItem,
  SuperLikeFeedResult,
} from "../../services/api/likerland-api.types"
import { logError } from "../../utils/error"

import { SuperLike } from "../super-like"
import { SuperLikeFeedModel } from "../super-like-feed"

/**
 * Following Super Like feed.
 */
export const SuperLikeFollowingFeedModel = SuperLikeFeedModel.named(
  "SuperLikeFollowingFeed",
)
  .props({
    /**
     * Start time of the feed in ms.
     */
    start: types.number,
    /**
     * End time of the feed in ms.
     */
    end: types.number,
  })
  .actions(self => {
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
        const result: SuperLikeFeedResult = yield self.env.likerLandAPI.fetchReaderSuperLikeFollowingFeed(
          {
            before: self.end,
            after: self.start,
            // XXX: Fetch all feeds for now
            limit: 1000,
          },
        )
        if (result.kind === "ok") {
          if (result.data?.length) {
            const items = result.data.map(
              createSuperLikeFollowingFeedItemFromData,
            )

            // HACK: For getting identifier references
            self.items.replace(items)
            self.items.replace(removeDuplicatedFeedItems(self.items))
          }
          self.setStatus("done")
        } else {
          self.setStatus("error")
        }
      } catch (error) {
        logError(error)
        self.setStatus("error")
      }
    })

    return {
      reset,
      fetch,
    }
  })

type SuperLikeFollowingFeedType = Instance<typeof SuperLikeFollowingFeedModel>
export interface SuperLikeFollowingFeed extends SuperLikeFollowingFeedType {}
type SuperLikeFollowingFeedSnapshotType = SnapshotOut<
  typeof SuperLikeFollowingFeedModel
>
export interface SuperLikeFollowingFeedSnapshot
  extends SuperLikeFollowingFeedSnapshotType {}
