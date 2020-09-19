import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { Content as ContentResultData } from "../../services/api/api.types"

import { ContentModel, ContentSnapshot } from "../content"
import { withCreatorsStore } from "../extensions"

/**
 * Store for all contents.
 */
const ContentsStoreBaseModel = types
  .model("ContentsStore")
  .props({
    items: types.map(types.late(() => ContentModel)),
  })
  .extend(withCreatorsStore)
  .actions(self => {
    function createItemFromData(data: ContentResultData) {
      const {
        image: imageURL,
        ts: timestamp,
        like: likeCount,
        referrer,
        url,
        user: likerID,
        ...rest
      } = data

      const contentURL = referrer || url
      let content = self.items.get(contentURL)
      if (!content) {
        content = ContentModel.create({
          url: contentURL,
          imageURL,
          timestamp,
          likeCount,
          ...rest,
        })
        self.items.put(content)
        if (likerID) {
          content.setCreator(self.createCreatorFromLikerID(likerID))
        }
      }

      content.setTimestamp(data.ts)

      return content
    }

    function createItemFromURL(url: string) {
      if (url) {
        return createItemFromData({ url })
      }
      return undefined
    }

    return {
      createItemFromData,
      createItemFromURL,
    }
  })

export const ContentsStoreModel = types.snapshotProcessor(
  ContentsStoreBaseModel,
  {
    postProcessor(snapshot) {
      const items: { [key: string]: ContentSnapshot } = {}
      Object.keys(snapshot.items)
        .sort((idA, idB) => {
          const contentA = snapshot.items[idA]
          const contentB = snapshot.items[idB]
          if (!contentA) return -1
          if (!contentB) return 1
          return contentB.lastFetchedAt - contentA.lastFetchedAt
        })
        .slice(0, 1000)
        .forEach(id => {
          items[id] = snapshot.items[id]
        })

      return {
        items,
      }
    },
  },
)

type ContentsStoreType = Instance<typeof ContentsStoreModel>
export interface ContentsStore extends ContentsStoreType {}
type ContentsStoreSnapshotType = SnapshotOut<typeof ContentsStoreModel>
export interface ContentsStoreSnapshot extends ContentsStoreSnapshotType {}
