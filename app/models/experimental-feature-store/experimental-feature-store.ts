import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions"

/**
 * Store for experimental features configuration
 */
export const ExperimentalFeatureStoreModel = types
  .model("ExperimentalFeatureStoreModel")
  .props({
    isWalletConnectEnabled: types.optional(types.boolean, true),
  })
  .extend(withEnvironment)
  .views(self => ({
    get shouldWalletConnectEnabled() {
      return self.getConfig("WALLET_CONNECT_ENABLE") === "true"
    },
  }))
  .views(self => ({
    get isWalletConnectActivated() {
      return self.shouldWalletConnectEnabled && self.isWalletConnectEnabled
    },
    get shouldEnabled() {
      return self.shouldWalletConnectEnabled
    },
  }))
  .actions(self => ({
    setIsWalletConnectEnabled(value: boolean) {
      self.isWalletConnectEnabled = value
    },
  }))

type ExperimentalFeatureStoreType = Instance<typeof ExperimentalFeatureStoreModel>
export interface ExperimentalFeatureStore extends ExperimentalFeatureStoreType {}
type ExperimentalFeatureStoreSnapshotType = SnapshotOut<typeof ExperimentalFeatureStoreModel>
export interface ExperimentalFeatureStoreSnapshot extends ExperimentalFeatureStoreSnapshotType {}
