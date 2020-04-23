import {
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

enum FetchingStatus {
  Unfetched = "unfetched",
  Fetching = "fetching",
  Fetched = "fetched",
}

/**
 * Model with status
 */
export const StateModel = types
  .model("State")
  .props({
    state: types.optional(types.enumeration<FetchingStatus>(Object.values(FetchingStatus)), FetchingStatus.Unfetched),
  })
  .volatile(() => ({
    hasRecentlyFetched: false,
  }))
  .views(self => ({
    get isFetching() {
      return self.state === FetchingStatus.Fetching
    },
    get hasFetched() {
      return self.state === FetchingStatus.Fetched
    },
  }))
  .actions(self => ({
    setUnfetched() {
      self.state = FetchingStatus.Unfetched
    },
    setFetching() {
      self.state = FetchingStatus.Fetching
      self.hasRecentlyFetched = true
    },
    setFetched() {
      self.state = FetchingStatus.Fetched
    },
  }))

type StateType = Instance<typeof StateModel>
export interface State extends StateType {}
type StateSnapshotType = SnapshotOut<typeof StateModel>
export interface StateSnapshot extends StateSnapshotType {}
