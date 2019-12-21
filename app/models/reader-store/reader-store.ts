import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import { uniqBy } from "ramda"

import { Content, ContentModel } from "../content"
import { withEnvironment } from "../extensions"

import { ContentListResult, Content as ContentResult } from "../../services/api/api.types"
import { logError } from "../../utils/error"

const ContentList = types.array(types.safeReference(ContentModel))

function getContentId(content: Content) {
  return content.url
}

function uniq(list: Content[]) {
  return uniqBy(getContentId, list)
}

export function sortContentForSnapshot(a: Content, b: Content) {
  return b.timestamp - a.timestamp
}

/**
 * Store all content related information.
 */
export const ReaderStoreModel = types
  .model("ReaderStore")
  .props({
    contents: types.map(ContentModel),
    featuredList: ContentList,
    followedList: ContentList,
  })
  .volatile(() => ({
    isFetchingSuggestList: false,
    hasFetchedSuggestList: false,
    isFetchingFollowedList: false,
    hasFetchedFollowedList: false,
    isFetchingMoreFollowedList: false,
    hasReachedEndOfFollowedList: false,
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
      self.hasFetchedSuggestList = false
      self.followedList.replace([])
      self.hasFetchedFollowedList = false
    },
    createContentFromContentResult(result: ContentResult) {
      const {
        referrer: url,
        image: imageURL,
        ts: timestamp,
        like: likeCount,
        user: creatorLikerID,
        ...rest
      } = result
      const content = ContentModel.create({
        url,
        imageURL,
        timestamp,
        likeCount,
        creatorLikerID,
        ...rest
      })
      self.contents.put(content)
      return content
    },
    parseContentResult(result: ContentResult) {
      let content = self.contents.get(result.referrer)
      if (!content) {
        content = this.createContentFromContentResult(result)
      }
      content.setTimestamp(result.ts)
      return content
    },
    parseContentResultList(results: ContentResult[]) {
      const contents: Content[] = []
      results.forEach((result) => {
        contents.push(this.parseContentResult(result))
      })
      return uniq(contents)
    },
    getContentByURL(url: string) {
      return this.parseContentResult({ url })
    },
  }))
  .actions(self => ({
    fetchSuggestList: flow(function * () {
      self.isFetchingSuggestList = true
      try {
        const result: ContentListResult = yield self.env.likerLandAPI.fetchReaderSuggest()
        switch (result.kind) {
          case "ok":
            self.featuredList.replace(self.parseContentResultList(result.data))
        }
      } catch (error) {
        logError(error.message)
      } finally {
        self.isFetchingSuggestList = false
        self.hasFetchedSuggestList = true
      }
    }),
    fetchFollowedList: flow(function * () {
      self.isFetchingFollowedList = true
      try {
        const result: ContentListResult = yield self.env.likerLandAPI.fetchReaderFollowing()
        switch (result.kind) {
          case "ok":
            self.followedList.replace(self.parseContentResultList(result.data))
        }
      } catch (error) {
        logError(error.message)
      } finally {
        self.isFetchingFollowedList = false
        self.hasFetchedFollowedList = true
        self.hasReachedEndOfFollowedList = false
      }
    }),
    fetchMoreFollowedList: flow(function * () {
      self.isFetchingMoreFollowedList = true
      try {
        const lastContent = self.followedList[self.followedList.length - 1]
        const result: ContentListResult = yield self.env.likerLandAPI.fetchReaderFollowing({
          before: lastContent.timestamp,
        })
        switch (result.kind) {
          case "ok":
            const contents = self.parseContentResultList(result.data)
            self.followedList.replace(uniq(self.followedList.concat(contents)))
            if (!contents.length) {
              self.hasReachedEndOfFollowedList = true
            }
        }
      } catch (error) {
        logError(error.message)
      } finally {
        self.isFetchingMoreFollowedList = false
      }
    }),
  }))

type ReaderStoreType = Instance<typeof ReaderStoreModel>
export interface ReaderStore extends ReaderStoreType {}
type ReaderStoreSnapshotType = SnapshotOut<typeof ReaderStoreModel>
export interface ReaderStoreSnapshot extends ReaderStoreSnapshotType {}
