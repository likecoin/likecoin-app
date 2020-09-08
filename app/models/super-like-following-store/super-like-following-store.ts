import { applySnapshot, Instance, SnapshotOut, types } from "mobx-state-tree"

import {
  SuperLikeDailyFeedModel,
  SuperLikeDailyFeed,
} from "../super-like-daily-feed"
import moment from "moment"
import { withEnvironment } from "../extensions"

const FETCHING_INTERVAL = 300000

/**
 * Store for Super Like feed from following creators.
 */
export const SuperLikeFollowingStoreModel = types
  .model("SuperLikeFollowingStore")
  .props({
    /**
     * Storing all daily feeds.
     */
    allDailyFeeds: types.map(SuperLikeDailyFeedModel),
    /**
     * List of pages with reference of the daily feeds.
     */
    pagedFeeds: types.array(types.safeReference(SuperLikeDailyFeedModel)),
  })
  .extend(withEnvironment)
  .postProcessSnapshot((snapshot) => {
    // Keep feeds of allDailyFeeds which exist in pagedFeeds only
    const { pagedFeeds } = snapshot
    const allDailyFeeds = {}
    pagedFeeds.forEach(id => {
      const feed = snapshot.allDailyFeeds[id]
      if (feed) allDailyFeeds[id] = feed
    })
    return {
      allDailyFeeds,
      pagedFeeds,
    }
  })
  .volatile(() => ({
    selectedPageIndex: 0,
  }))
  .views(self => ({
    get pageCount() {
      return self.pagedFeeds.length
    },
    getMaxPageCount() {
      return parseInt(self.getConfig("MAX_FOLLOWING_SUPERLIKE_PAGE"))
    },
    get isFirstPage() {
      return self.selectedPageIndex === 0
    },
    get isLastPage() {
      return self.selectedPageIndex === this.pageCount - 1
    },
    get firstFeed() {
      return this.pageCount > 0 ? self.pagedFeeds[0] : undefined
    },
    get selectedFeed() {
      return this.pageCount > 0
        ? self.pagedFeeds[self.selectedPageIndex]
        : undefined
    },
  }))
  .actions(self => {
    function reset() {
      applySnapshot(self, {})
    }

    function getPage(pageIndex: number) {
      const id = moment()
        .startOf("day")
        .subtract(pageIndex, "days")
        .format()
      if (self.allDailyFeeds.has(id)) {
        return self.allDailyFeeds.get(id)
      }
      return self.allDailyFeeds.put(
        SuperLikeDailyFeedModel.create({
          id: moment()
            .startOf("day")
            .subtract(pageIndex, "days")
            .format(),
        }),
      )
    }

    function goToPage(pageIndex: number) {
      if (pageIndex >= 0 && pageIndex <= self.pageCount - 1) {
        if (
          pageIndex >= self.pageCount - 2 &&
          self.pageCount < self.getMaxPageCount()
        ) {
          // Preload page
          self.pagedFeeds.push(getPage(self.pageCount))
        }
        self.selectedPageIndex = pageIndex
      }
      return self.selectedPageIndex
    }

    return {
      reset,
      refreshPage() {
        if (self.pageCount === 0 || !self.pagedFeeds[0].isToday()) {
          const pagedFeeds = [] as SuperLikeDailyFeed[]
          for (let pageIndex = 0; pageIndex < 3; pageIndex += 1) {
            pagedFeeds.push(getPage(pageIndex))
          }
          self.pagedFeeds.replace(pagedFeeds)
          self.selectedPageIndex = 0
        }
        if (Date.now() - self.firstFeed?.lastFetched >= FETCHING_INTERVAL) {
          self.firstFeed.fetch()
        }
      },
      goToPage,
      goToNextPage() {
        return goToPage(self.selectedPageIndex + 1)
      },
      goToPreviousPage() {
        return goToPage(self.selectedPageIndex - 1)
      },
    }
  })

type SuperLikeFollowingStoreType = Instance<typeof SuperLikeFollowingStoreModel>
export interface SuperLikeFollowingStore extends SuperLikeFollowingStoreType {}
type SuperLikeFollowingStoreSnapshotType = SnapshotOut<
  typeof SuperLikeFollowingStoreModel
>
export interface SuperLikeFollowingStoreSnapshot
  extends SuperLikeFollowingStoreSnapshotType {}
