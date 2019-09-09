import { Instance, SnapshotOut, types, flow, getEnv } from "mobx-state-tree"

import { ContentModel } from "../content";
import { Environment } from "../environment";
import { ContentListResult } from "../../services/api/api.types";

/**
 * Store all content related information.
 */
export const ReaderStoreModel = types
  .model("ReaderStore")
  .props({
    contents: types.optional(types.map(ContentModel), {}),
    suggestedList: types.optional(
      types.array(types.reference(ContentModel)),
      []
    )
  })
  .actions(self => ({
    clearAllLists() {
      self.suggestedList.replace([])
    },
    fetchSuggestList: flow(function*() {
      const env: Environment = getEnv(self)
      try {
        const result: ContentListResult = yield env.likerLandAPI.fetchReaderSuggest()
        switch (result.kind) {
          case "ok":
            self.suggestedList.replace([])
            result.data.forEach(({ referrer: url }) => {
              let content = self.contents.get(url)
              if (!content) {
                content = ContentModel.create({ url })
                self.contents.set(url, content)
              }
              self.suggestedList.push(content)
            })
        }
      } catch (error) {
        __DEV__ && console.tron.error(error.message, null)
      }
    }),
  }))

type ReaderStoreType = Instance<typeof ReaderStoreModel>
export interface ReaderStore extends ReaderStoreType {}
type ReaderStoreSnapshotType = SnapshotOut<typeof ReaderStoreModel>
export interface ReaderStoreSnapshot extends ReaderStoreSnapshotType {}
