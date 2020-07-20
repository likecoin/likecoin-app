import {
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { ContentModel } from "../content"
import { CreatorModel } from "../creator"

/**
 * Super Liked Content
 */
export const SuperLikedContentModel = types
  .model("SuperLikedContent")
  .props({
    id: types.identifier,
    content: types.safeReference(types.late(() => ContentModel)),
    liker: types.safeReference(types.late(() => CreatorModel)),
    timestamp: types.number,
  })

type SuperLikedContentType = Instance<typeof SuperLikedContentModel>
export interface SuperLikedContent extends SuperLikedContentType {}
type SuperLikedContentSnapshotType = SnapshotOut<typeof SuperLikedContentModel>
export interface SuperLikedContentSnapshot extends SuperLikedContentSnapshotType {}

export interface SuperLikedContentsGroupedByDay {
  [dayTs: string]: SuperLikedContent[]
}
