import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { splitWhen } from "ramda"

import { withEnvironment, withStatus } from "../extensions"
import { NotificationModel, Notification } from "../notification"

import {
  GeneralResult,
  NotificationsResult,
  NotificationResult,
} from "../../services/api"

/**
 * Notification store.
 */
export const NotificationStoreModel = types
  .model("NotificationStore")
  .props({
    recentItems: types.array(NotificationModel),
    earilerItems: types.array(NotificationModel),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .postProcessSnapshot(snapshot => {
    // Move `recentItems` to `earilerItems` and remove items beyond 1000 
    return {
      recentItems: [],
      earilerItems: snapshot.recentItems
        .concat(snapshot.earilerItems)
        .slice(0, 999),
    }
  })
  .views(self => ({
    get items() {
      return self.recentItems.concat(self.earilerItems)
    },
    get itemsSplitByRead() {
      return splitWhen<Notification, Notification>(
        item => item.isRead,
        this.items,
      )
    },
    get unread() {
      return this.itemsSplitByRead[0]
    },
    get read() {
      return this.itemsSplitByRead[1]
    },
    get sections() {
      const sections: { key: string; data: Notification[] }[] = []
      if (this.unread.length)
        sections.push({ key: "unread", data: this.unread })
      if (this.read.length) sections.push({ key: "read", data: this.read })
      return sections
    },
  }))
  .actions(self => {
    function createModelFromResult({
      id,
      type,
      ts: timestamp,
      isRead,
      from: fromTarget,
      to: toTarget,
      LIKE,
      txHash,
      sourceURL: contentURL,
    }: NotificationResult) {
      return NotificationModel.create({
        id,
        type,
        timestamp,
        isRead,
        fromTarget: fromTarget,
        toTarget: toTarget,
        likeAmount: typeof LIKE === "string" ? parseFloat(LIKE) : LIKE,
        txHash,
        contentURL,
      }, self.env)
    }

    async function fetchItems({
      before,
      after,
    }: {
      before?: number
      after?: number
    } = {}) {
      return self.env.likeCoinAPI.users.notifications.get({
        before,
        after,
        limit: 6,
      })
    }

    const fetchRecent = flow(function*(opts?: {
      before?: number
      after?: number
    }) {
      self.status = "pending"
      const response: NotificationsResult = yield fetchItems(opts)
      if (response.kind === "ok") {
        self.status = "done"
        if (response.data.length) {
          const items = response.data.map(createModelFromResult)
          if (opts.before) {
            self.recentItems.push(...items)
          } else {
            self.recentItems.unshift(...items)
          }
          // Recursively fetch more recent items
          yield fetchRecent({
            before: self.recentItems[self.recentItems.length - 1].timestamp,
            after: self.earilerItems[0]?.timestamp || 0,
          })
        }
      } else {
        self.status = "error"
      }
    })

    const fetchLatest = flow(function*() {
      self.status = "pending"
      const response: NotificationsResult = yield fetchItems()
      if (response.kind === "ok") {
        if (response.data.length) {
          self.status = "done"
          const items = response.data.map(createModelFromResult)
          self.recentItems.replace(items)
        } else {
          self.status = "done-more"
        }
      } else {
        self.status = "error"
      }
    })

    const fetchEarlier = flow(function*() {
      self.status = "pending-more"
      const response: NotificationsResult = yield fetchItems({
        before: self.items[self.items.length - 1].timestamp,
      })
      if (response.kind === "ok") {
        if (response.data.length) {
          self.status = "done"
          const items = response.data.map(createModelFromResult)
          self.earilerItems.push(...items)
        } else {
          self.status = "done-more"
        }
      } else {
        self.status = "error"
      }
    })

    return {
      fetchRecent,
      fetchEarlier,
      fetch: flow(function*() {
        if (self.items.length) {
          yield fetchRecent({ after: self.items[0].timestamp })
        } else {
          yield fetchLatest()
        }
      }),
      readAll: flow(function*() {
        if (self.unread.length > 0) {
          const response: GeneralResult = yield self.env.likeCoinAPI.users.notifications.readAll(
            self.unread[0].timestamp + 1,
          )
          if (response.kind === "ok") {
            self.unread.forEach(item => item.read())
          }
        }
      }),
    }
  })

type NotificationStoreType = Instance<typeof NotificationStoreModel>
export interface NotificationStore extends NotificationStoreType {}
type NotificationStoreSnapshotType = SnapshotOut<typeof NotificationStoreModel>
export interface NotificationStoreSnapshot
  extends NotificationStoreSnapshotType {}
