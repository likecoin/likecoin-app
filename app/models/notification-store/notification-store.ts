import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import { withEnvironment, withStatus } from "../extensions"
import { NotificationModel, Notification } from "../notification"

import { NotificationsResult, NotificationResult } from "../../services/api"
import { splitWhen } from "ramda"

/**
 * Notification store.
 */
export const NotificationStoreModel = types
  .model("NotificationStore")
  .props({
    items: types.array(NotificationModel),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .views(() => ({
    createModelFromResult({
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
        isSeen: isRead,
        fromTarget: fromTarget,
        toTarget: toTarget,
        likeAmount: typeof LIKE === "string" ? parseFloat(LIKE) : LIKE,
        txHash,
        contentURL,
      })
    },
  }))
  .views(self => ({
    get itemsSplitBySeen() {
      return splitWhen<Notification, Notification>(
        item => item.isSeen,
        self.items,
      )
    },
    get sections() {
      const sections: { key: string; data: Notification[] }[] = []
      const [unseen, seen] = this.itemsSplitBySeen
      if (unseen.length) sections.push({ key: "unseen", data: unseen })
      if (seen.length) sections.push({ key: "seen", data: seen })
      return sections
    },
  }))
  .actions(self => ({
    fetch: flow(function * () {
      self.status = "pending"
      const response: NotificationsResult = yield self.env.likeCoAPI.users.notifications.get()
      if (response.kind === "ok") {
        self.status = "done"
        const items = response.data.map(self.createModelFromResult)
        self.items.replace(items)
      } else {
        self.status = "error"
      }
    }),
  }))

type NotificationStoreType = Instance<typeof NotificationStoreModel>
export interface NotificationStore extends NotificationStoreType {}
type NotificationStoreSnapshotType = SnapshotOut<typeof NotificationStoreModel>
export interface NotificationStoreSnapshot
  extends NotificationStoreSnapshotType {}
