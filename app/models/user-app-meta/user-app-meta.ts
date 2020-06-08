import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * App Meta
 */
export const UserAppMetaModel = types
  .model("UserAppMeta")
  .props({
    isNew: types.maybe(types.boolean),
    isEmailVerified: types.optional(types.boolean, false),
    firstOpenTs: types.optional(types.number, 0),
    hasAndroid: types.optional(types.boolean, false),
    hasIOS: types.optional(types.boolean, false),
  })

type UserAppMetaType = Instance<typeof UserAppMetaModel>
export interface UserAppMeta extends UserAppMetaType {}
type UserAppMetaSnapshotType = SnapshotOut<typeof UserAppMetaModel>
export interface UserAppMetaSnapshot extends UserAppMetaSnapshotType {}
