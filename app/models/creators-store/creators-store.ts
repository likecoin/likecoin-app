import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { CreatorModel } from "../creator"
import { CreatorSnapshot } from "../creator/creator"
import { withCreatorsFollowStore, withEnvironment } from "../extensions"

/**
 * Store for creators.
 */
const CreatorsStoreModelBase = types
  .model("CreatorsStore")
  .props({
    creators: types.map(CreatorModel),
  })
  .volatile(() => ({
    isFetching: false,
  }))
  .extend(withCreatorsFollowStore)
  .extend(withEnvironment)
  .views(self => {
    function getFollowedCreators(isFollowing: boolean) {
      return [...self.creators.keys()]
        .filter(id => !!self.creators.get(id)?.isFollowing === isFollowing)
        .sort()
        .map(id => self.creators.get(id))
    }

    return {
      get followingCreators() {
        return getFollowedCreators(true)
      },
      get unfollowedCreators() {
        return getFollowedCreators(false)
      },
    }
  })
  .actions(self => {
    function createCreatorFromLikerID(likerID: string) {
      let creator = self.creators.get(likerID)
      if (!creator) {
        creator = CreatorModel.create({ likerID }, self.env)
        self.creators.put(creator)
      }
      return creator
    }

    return {
      createCreatorFromLikerID,
    }
  })

export const CreatorsStoreModel = types.snapshotProcessor(
  CreatorsStoreModelBase,
  {
    postProcessor(snapshot) {
      // Filter only last 1000 fetched creators
      const creators: { [key: string]: CreatorSnapshot } = {}
      Object.keys(snapshot.creators)
        .sort((idA, idB) => {
          const creatorA = snapshot.creators[idA]
          const creatorB = snapshot.creators[idB]
          if (!creatorA) return -1
          if (!creatorB) return 1
          return creatorB.lastFetchedAt - creatorA.lastFetchedAt
        })
        .slice(0, 1000)
        .forEach(id => {
          creators[id] = snapshot.creators[id]
        })

      return {
        creators,
      }
    },
  },
)

type CreatorsStoreType = Instance<typeof CreatorsStoreModel>
export interface CreatorsStore extends CreatorsStoreType {}
type CreatorsStoreSnapshotType = SnapshotOut<typeof CreatorsStoreModel>
export interface CreatorsStoreSnapshot extends CreatorsStoreSnapshotType {}
