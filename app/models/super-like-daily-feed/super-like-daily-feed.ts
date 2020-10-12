import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"

import { withDateUtils, withUserAppMeta } from "../extensions"

import { SuperLikeFollowingFeedModel } from "../super-like-following-feed"

const SLOT_INTERVAL = 12 // In hours

/**
 * Super Like daily feed.
 */
export const SuperLikeDailyFeedModel = types
  .model("SuperLikeDailyFeed")
  .props({
    /**
     * Identifier of the daily feed. Represent the start time of the feed.
     * in ISO 8601 format
     */
    id: types.identifier,
    /**
     * Morning feed.
     */
    morningFeed: types.maybe(SuperLikeFollowingFeedModel),
    /**
     * Evening feed.
     */
    eveningFeed: types.maybe(SuperLikeFollowingFeedModel),

    /**
     * Last fetched time in ms.
     */
    lastFetched: types.optional(types.number, 0),
  })
  .extend(withDateUtils)
  .extend(withUserAppMeta)
  .views(self => ({
    get start() {
      return self.getDateInMs(self.id)
    },
    get items() {
      return (self.eveningFeed?.items || []).concat(
        self.morningFeed?.items || [],
      )
    },
    get isFetching() {
      return (
        self.morningFeed.status === "pending" ||
        self.eveningFeed.status === "pending"
      )
    },
    hasFetchedAll() {
      return !this.isEveningFeedFetchable()
        ? self.morningFeed.status === "done"
        : self.morningFeed.status === "done" &&
            self.eveningFeed.status === "done"
    },
    isToday() {
      return self.getIsToday(this.start)
    },
    isYesterday() {
      return self.getIsYesterday(this.start)
    },
    isEveningFeedFetchable() {
      return self.getIsAfternoon(Date.now())
    },
  }))
  .actions(self => ({
    afterCreate() {
      // Initialize the morning and evening feed if not created.
      if (!self.morningFeed) {
        self.morningFeed = SuperLikeFollowingFeedModel.create({
          start: self.start - 3600000 * SLOT_INTERVAL,
          end: self.start - 1,
        })
      }
      if (!self.eveningFeed) {
        self.eveningFeed = SuperLikeFollowingFeedModel.create({
          start: self.start,
          end: self.start + 3600000 * SLOT_INTERVAL - 1,
        })
      }
    },
    fetch: flow(function*() {
      self.lastFetched = Date.now()
      const promises = [] as Promise<void>[]
      if (
        self.isEveningFeedFetchable() &&
        self.eveningFeed.status !== "pending"
      ) {
        promises.push(self.eveningFeed.fetch())
      }
      if (self.morningFeed.status !== "pending") {
        const { current: extraContent } = self.userAppMeta.introContent
        promises.push(
          self.morningFeed.fetch({
            extraItem:
              self.isToday() &&
              self.userAppMeta.getShouldShowIntroContent() &&
              extraContent
                ? extraContent
                : null,
          }),
        )
      }
      yield Promise.all(promises)
    }),
  }))

type SuperLikeDailyFeedType = Instance<typeof SuperLikeDailyFeedModel>
export interface SuperLikeDailyFeed extends SuperLikeDailyFeedType {}
type SuperLikeDailyFeedSnapshotType = SnapshotOut<
  typeof SuperLikeDailyFeedModel
>
export interface SuperLikeDailyFeedSnapshot
  extends SuperLikeDailyFeedSnapshotType {}
