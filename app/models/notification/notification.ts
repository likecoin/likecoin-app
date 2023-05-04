import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { withEnvironment } from "../extensions"

/**
 * Notification Model.
 */
export const NotificationModel = types
  .model("Notification")
  .props({
    id: types.identifier,
    type: types.string,
    timestamp: types.number,
    isRead: types.optional(types.boolean, false),

    // Transaction related property
    likeAmount: types.maybe(types.number),
    fromTarget: types.maybe(types.string),
    toTarget: types.maybe(types.string),
    txHash: types.maybe(types.string),

    // Content related property
    contentURL: types.maybe(types.string),
  })
  .extend(withEnvironment)
  .views(self => ({
    get txURL() {
      return self.txHash ? self.env.mintscan.getTransactionURL(self.txHash) : undefined
    },
  }))
  .actions(self => ({
    read() {
      self.isRead = true
    },
  }))

type NotificationType = Instance<typeof NotificationModel>
export interface Notification extends NotificationType {}
type NotificationSnapshotType = SnapshotOut<typeof NotificationModel>
export interface NotificationSnapshot extends NotificationSnapshotType {}
