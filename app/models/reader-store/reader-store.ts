import { Instance, SnapshotOut, types, flow, getEnv } from "mobx-state-tree"

import { ContentModel } from "../content"
import { Environment } from "../environment"
import { ContentListResult } from "../../services/api/api.types"
import { observable } from "mobx"

const contentListTypes = types.optional(
  types.array(types.reference(ContentModel)),
  []
)

/**
 * Store all content related information.
 */
export const ReaderStoreModel = types
  .model("ReaderStore")
  .props({
    contents: types.optional(types.map(ContentModel), {}),
    featuredList: contentListTypes,
    followedList: contentListTypes,
  })
  .extend(self => {
    const env: Environment = getEnv(self)

    const isFetchingSuggestList = observable.box(false)
    const isFetchingFollowedList = observable.box(false)

    const clearAllLists = () => {
      self.featuredList.replace([])
      self.followedList.replace([])
    }

    const getContentByURL = (url: string) => {
      // TODO: Refactor
      let content = self.contents.get(url)
      if (!content) {
        content = ContentModel.create({ url })
        self.contents.set(url, content)
      }
      return content
    }

    const fetchSuggestList = flow(function * () {
      isFetchingSuggestList.set(true)
      try {
        const result: ContentListResult = yield env.likerLandAPI.fetchReaderSuggest()
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
        __DEV__ && console.tron.error(error.message, null)
      } finally {
        isFetchingSuggestList.set(false)
      }
    })

    const fetchFollowedList = flow(function * () {
      isFetchingFollowedList.set(true)
      try {
        const result: ContentListResult = yield env.likerLandAPI.fetchReaderFollowing()
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
        __DEV__ && console.tron.error(error.message, null)
      } finally {
        isFetchingFollowedList.set(false)
      }
    })

    return {
      views: {
        get isLoading() {
          return isFetchingSuggestList.get() || isFetchingFollowedList.get()
        },
      },
      actions: {
        clearAllLists,
        getContentByURL,
        fetchSuggestList,
        fetchFollowedList,
      },
    }
  })

type ReaderStoreType = Instance<typeof ReaderStoreModel>
export interface ReaderStore extends ReaderStoreType {}
type ReaderStoreSnapshotType = SnapshotOut<typeof ReaderStoreModel>
export interface ReaderStoreSnapshot extends ReaderStoreSnapshotType {}
