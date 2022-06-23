import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { SuperLikeFeedItem } from "../../services/api/likerland-api.types"
import { withContentsStore, withCreatorsStore, withEnvironment, withStatus } from "../extensions"
import { SuperLikeModel } from "../super-like"

/**
 * Super Like feed.
 */
export const SuperLikeFeedModel = types
  .model("SuperLikeFeed")
  .props({
    /**
     * Super Like items.
     */
    items: types.array(SuperLikeModel),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .extend(withContentsStore)
  .extend(withCreatorsStore)
  .actions(self => {
    /**
     * Deserialize Super Like feed item response to model
     * @param item Serialized Super Like feed item
     * @param options Optional extra options for creating model
     * @return A Super Like model
     */
    function createSuperLikeFeedItemFromData(
      {
        superLikeID,
        superLikeShortID,
        superLikeIscnId,
        url,
        referrer,
        liker,
        user: likee,
        ts,
      }: SuperLikeFeedItem,
      options: {
        isFollowing?: boolean
      } = {},
    ) {
      const superLike = SuperLikeModel.create(
        {
          id: superLikeID,
          shortId: superLikeShortID,
          iscnId: superLikeIscnId,
          timestamp: ts,
        },
        self.env,
      )

      const superLiker = self.createCreatorFromLikerID(liker, {
        isFollowing: options.isFollowing,
      })
      superLike.addLiker(superLiker)

      // Find content reference for this Super Like
      const contentURL = referrer || url
      let content = self.contentsStore.items.get(contentURL)
      if (!content) {
        content = self.createContentFromData({
          url: contentURL,
          iscnId: superLikeIscnId,
          user: likee,
        })
      }

      superLike.setContent(content)

      return superLike
    }

    return {
      createSuperLikeFeedItemFromData,
    }
  })

type SuperLikeFeedType = Instance<typeof SuperLikeFeedModel>
export interface SuperLikeFeed extends SuperLikeFeedType {}
type SuperLikeFeedSnapshotType = SnapshotOut<typeof SuperLikeFeedModel>
export interface SuperLikeFeedSnapshot extends SuperLikeFeedSnapshotType {}
