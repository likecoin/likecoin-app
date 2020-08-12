import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Notification Model.
 */
export const NotificationModel = types.model("Notification").props({
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
.actions(self => ({
  read() {
    self.isRead = true
  },
}))

type NotificationType = Instance<typeof NotificationModel>
export interface Notification extends NotificationType {}
type NotificationSnapshotType = SnapshotOut<typeof NotificationModel>
export interface NotificationSnapshot extends NotificationSnapshotType {}
