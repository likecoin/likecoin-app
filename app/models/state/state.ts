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
    lastFetched: null as number,
  }))
  .views(self => ({
    get isFetching() {
      return self.state === FetchingStatus.Fetching
    },
    get hasFetched() {
      return self.state === FetchingStatus.Fetched
    },
    get hasRecentlyFetched() {
      return self.lastFetched !== null
    },
    /**
     * Check whether the last fetch is under 10s
     */
    getIsJustFetched() {
      return Date.now() - self.lastFetched <= 10000
    },
  }))
  .actions(self => ({
    setUnfetched() {
      self.state = FetchingStatus.Unfetched
    },
    setFetching() {
      self.state = FetchingStatus.Fetching
      self.lastFetched = Date.now()
    },
    setFetched() {
      self.state = FetchingStatus.Fetched
    },
  }))

type StateType = Instance<typeof StateModel>
export interface State extends StateType {}
type StateSnapshotType = SnapshotOut<typeof StateModel>
export interface StateSnapshot extends StateSnapshotType {}
