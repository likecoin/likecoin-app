import {
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { ContentModel, Content } from "../content"
import { CreatorModel, Creator } from "../creator"

/**
 * Super Liked Content
 */
export const SuperLikedContentModel = types
  .model("SuperLikedContent")
  .props({
    id: types.identifier,
    content: types.safeReference(types.late(() => ContentModel)),
    liker: types.safeReference(types.late(() => CreatorModel)),
    timestamp: types.maybe(types.number),
  })
  .actions(self => ({
    setContent(content: Content) {
      self.content = content
    },
    setLiker(liker: Creator) {
      self.liker = liker
    },
  }))

type SuperLikedContentType = Instance<typeof SuperLikedContentModel>
export interface SuperLikedContent extends SuperLikedContentType {}
type SuperLikedContentSnapshotType = SnapshotOut<typeof SuperLikedContentModel>
export interface SuperLikedContentSnapshot extends SuperLikedContentSnapshotType {}

export interface SuperLikedContentsGroupedByDay {
  [dayTs: string]: SuperLikedContent[]
}
