import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { ContentModel } from "../content"
import { withEnvironment } from "../extensions"

import { ContentListResult } from "../../services/api/api.types"
import { logError } from "../../utils/error"

const contentListTypes = types.array(types.reference(ContentModel))

/**
 * Store all content related information.
 */
export const ReaderStoreModel = types
  .model("ReaderStore")
  .props({
    contents: types.map(ContentModel),
    featuredList: contentListTypes,
    followedList: contentListTypes,
  })
  .volatile(() => ({
    isFetchingSuggestList: false,
    isFetchingFollowedList: false,
  }))
  .extend(withEnvironment)
  .views(self => ({
    get isLoading() {
      return self.isFetchingSuggestList ||
        self.isFetchingFollowedList
    },
  }))
  .actions(self => ({
    clearAllLists: () => {
      self.featuredList.replace([])
      self.followedList.replace([])
    },
    getContentByURL: (url: string) => {
      // TODO: Refactor
      let content = self.contents.get(url)
      if (!content) {
        content = ContentModel.create({ url })
        self.contents.set(url, content)
      }
      return content
    },
    fetchSuggestList: flow(function * () {
      self.isFetchingSuggestList = true
      try {
        const result: ContentListResult = yield self.env.likerLandAPI.fetchReaderSuggest()
        switch (result.kind) {
          case "ok":
            self.featuredList.replace([])
            result.data.forEach(({ referrer: url }) => {
              let content = self.contents.get(url)
              if (!content) {
                content = ContentModel.create({ url })
                self.contents.set(url, content)
              }
              self.featuredList.push(content)
            })
        }
      } catch (error) {
        logError(error.message)
      } finally {
        self.isFetchingSuggestList = false
      }
    }),
    fetchFollowedList: flow(function * () {
      self.isFetchingFollowedList = true
      try {
        const result: ContentListResult = yield self.env.likerLandAPI.fetchReaderFollowing()
        switch (result.kind) {
          case "ok":
            self.followedList.replace([])
            result.data.forEach(({ referrer: url }) => {
              let content = self.contents.get(url)
              if (!content) {
                content = ContentModel.create({ url })
                self.contents.set(url, content)
              }
              self.followedList.push(content)
            })
        }
      } catch (error) {
        logError(error.message)
      } finally {
        self.isFetchingFollowedList = false
      }
    }),
  }))

type ReaderStoreType = Instance<typeof ReaderStoreModel>
export interface ReaderStore extends ReaderStoreType {}
type ReaderStoreSnapshotType = SnapshotOut<typeof ReaderStoreModel>
export interface ReaderStoreSnapshot extends ReaderStoreSnapshotType {}
