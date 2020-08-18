import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import moment from "moment"

import { withEnvironment } from "../extensions"
import { SuperLikeFeedModel } from "../super-like-feed"

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
    morningFeed: types.maybe(SuperLikeFeedModel),
    /**
     * Evening feed.
     */
    eveningFeed: types.maybe(SuperLikeFeedModel),

    /**
     * Last fetched time in ms.
     */
    lastFetched: types.optional(types.number, 0),
  })
  .extend(withEnvironment)
  .views(self => ({
    get start() {
      return moment(self.id).valueOf()
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
    get hasFetchedAll() {
      return (
        self.morningFeed.status === "done" && self.eveningFeed.status === "done"
      )
    },
    isToday() {
      const now = moment()
      const start = moment(this.start)
      return (
        start.isSameOrAfter(now.startOf("day")) &&
        start.isSameOrBefore(now.endOf("day"))
      )
    },
    isYesterday() {
      const yesterday = moment().subtract(1, "day")
      const start = moment(this.start)
      return (
        start.isSameOrAfter(yesterday.startOf("day")) &&
        start.isSameOrBefore(yesterday.endOf("day"))
      )
    },
    isEveningFeedFetchable() {
      const now = moment()
      const noon = moment(this.start).add(12, "hours")
      return now.isSameOrAfter(noon)
    },
  }))
  .actions(self => ({
    afterCreate() {
      // Initialize the morning and evening feed if not created.
      if (!self.morningFeed) {
        self.morningFeed = SuperLikeFeedModel.create({
          start: self.start - 3600000 * SLOT_INTERVAL,
          end: self.start - 1,
        })
      }
      if (!self.eveningFeed) {
        self.eveningFeed = SuperLikeFeedModel.create({
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
        promises.push(self.morningFeed.fetch())
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
