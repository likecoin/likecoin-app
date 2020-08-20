import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import { SuperLikeFeedResult } from "../../services/api/likerland-api.types"
import { logError } from "../../utils/error"

import { withEnvironment, withReaderStore, withStatus } from "../extensions"
import { SuperLike, SuperLikeModel } from "../super-like"

/**
 * Model description here for TypeScript hints.
 */
export const SuperLikeFeedModel = types
  .model("SuperLikeFeed")
  .props({
    /**
     * Start time of the feed in ms.
     */
    start: types.number,
    /**
     * End time of the feed in ms.
     */
    end: types.number,
    /**
     * Super Like items.
     */
    items: types.array(SuperLikeModel),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .extend(withReaderStore)
  .actions(self => {
    function reset() {
      self.items.replace([])
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
        logError(error);
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
              self.readerStore.parseSuperLikeFeedItemToModel,
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

type SuperLikeFeedType = Instance<typeof SuperLikeFeedModel>
export interface SuperLikeFeed extends SuperLikeFeedType {}
type SuperLikeFeedSnapshotType = SnapshotOut<typeof SuperLikeFeedModel>
export interface SuperLikeFeedSnapshot extends SuperLikeFeedSnapshotType {}
