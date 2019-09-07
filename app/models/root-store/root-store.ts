import { ReaderStoreModel } from "../../models/reader-store"
import { UserStoreModel } from "../../models/user-store"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { NavigationStoreModel } from "../../navigation/navigation-store"

/**
 * An RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  readerStore: types.optional(ReaderStoreModel, {}),
  navigationStore: types.optional(NavigationStoreModel, {}),
  userStore: types.optional(UserStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export type RootStore = Instance<typeof RootStoreModel>

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = SnapshotOut<typeof RootStoreModel>
