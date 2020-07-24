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
export const SuperLikedContentModel = types
  .model("SuperLikedContent")
  .extend(withEnvironment)
  .props({
    id: types.identifier,
    content: types.safeReference(types.late(() => ContentModel)),
    liker: types.safeReference(types.late(() => CreatorModel)),
    timestamp: types.maybe(types.number),
  })
  .views(self => ({
    get redirectURL() {
      return `${self.getConfig("LIKECOIN_BUTTON_BASE_URL")}/in/redirect/superlike/${self.id}`
    },
  }))
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
