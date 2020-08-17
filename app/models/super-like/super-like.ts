import {
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { ContentModel, Content } from "../content"
import { CreatorModel, Creator } from "../creator"

import { withEnvironment } from "../extensions"

/**
 * Super Liked Content
 */
export const SuperLikeModel = types
  .model("SuperLikedContent")
  .extend(withEnvironment)
  .props({
    id: types.identifier,
    content: types.safeReference(types.late(() => ContentModel)),
    likers: types.array(types.safeReference(types.late(() => CreatorModel))),
    timestamp: types.maybe(types.number),
  })
  .views(self => ({
    /**
     * Return the first Super Liker.
     */
    get liker(): Creator {
      return self.likers[0]
    },
    get redirectURL() {
      return `${self.getConfig("LIKECOIN_BUTTON_BASE_URL")}/in/redirect/superlike/${self.id}`
    },
  }))
  .actions(self => ({
    setContent(content: Content) {
      self.content = content
    },
    addLiker(liker: Creator) {
      if (!self.likers.find(l => l.likerID === liker.likerID)) {
        self.likers.push(liker)
      }
    },
  }))

type SuperLikeType = Instance<typeof SuperLikeModel>
export interface SuperLike extends SuperLikeType {}
type SuperLikeSnapshotType = SnapshotOut<typeof SuperLikeModel>
export interface SuperLikeSnapshot extends SuperLikeSnapshotType {}

export interface SuperLikesGroupedByDay {
  [dayTs: string]: SuperLike[]
}
