import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * App Meta
 */
export const AppMetaModel = types
  .model("AppMeta")
  .props({
    isNew: types.maybe(types.boolean),
    isEmailVerified: types.optional(types.boolean, false),
    firstOpenTs: types.optional(types.number, 0),
    hasAndroid: types.optional(types.boolean, false),
    hasIOS: types.optional(types.boolean, false),
  })

type AppMetaType = Instance<typeof AppMetaModel>
export interface AppMeta extends AppMetaType {}
type AppMetaSnapshotType = SnapshotOut<typeof AppMetaModel>
export interface AppMetaSnapshot extends AppMetaSnapshotType {}
