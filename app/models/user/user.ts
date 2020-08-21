import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const UserModel = types
  .model("User")
  .props({
    likerID: types.identifier,
    displayName: types.maybe(types.string),
    email: types.maybe(types.string),
    avatarURL: types.maybe(types.string),
    cosmosWallet: types.maybe(types.string),
    isCivicLiker: types.optional(types.boolean, false),
    isSuperLiker: types.optional(types.boolean, false),
    canSuperLike: types.optional(types.boolean, false),
    nextSuperLikeTimestamp: types.optional(types.number, -1),
    superLikeCooldown: types.optional(types.number, 0),
  })
  .views(self => ({
    get qrCodeContentForPayment() {
      return JSON.stringify({
        likerId: self.likerID,
        skipToConfirm: false,
      })
    },
    get normalizedName() {
      return self.likerID || self.displayName || ""
    },
  }))

type UserType = Instance<typeof UserModel>
export interface User extends UserType {}
type UserSnapshotType = SnapshotOut<typeof UserModel>
export interface UserSnapshot extends UserSnapshotType {}
