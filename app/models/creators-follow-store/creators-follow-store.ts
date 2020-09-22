import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Store for managing creators' follow.
 */
export const CreatorsFollowStoreModel = types
  .model("CreatorsFollowStore")
  .props({
    settings: types.map(types.boolean),
  })
  .actions(self => ({
    reset() {
      self.settings.replace({})
    },
    updateAll(settings: { [key: string]: boolean }) {
      self.settings.replace(settings)
    },
    update(likerID: string, setting: boolean) {
      self.settings.set(likerID, setting)
    },
  }))

type CreatorsFollowStoreType = Instance<typeof CreatorsFollowStoreModel>
export interface CreatorsFollowStore extends CreatorsFollowStoreType {}
type CreatorsFollowStoreSnapshotType = SnapshotOut<typeof CreatorsFollowStoreModel>
export interface CreatorsFollowStoreSnapshot extends CreatorsFollowStoreSnapshotType {}
