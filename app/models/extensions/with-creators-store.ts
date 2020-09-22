import { getRoot, IStateTreeNode } from "mobx-state-tree"

import { CreatorsStore } from "../creators-store"

/**
 * Adds a creatorsStore property to the node for a convenient
 * and strongly typed way for stores to access other stores.
 */
export const withCreatorsStore = (self: IStateTreeNode) => ({
  views: {
    /**
     * The creators store.
     */
    get creatorsStore() {
      return getRoot(self).creatorsStore as CreatorsStore
    },
  },
  actions: {
    /**
     * Create a creator model from Liker ID
     * @param likerID
     * @param options A optional configuration for the creator
     * @return creator model
     */
    createCreatorFromLikerID(
      likerID: string,
      options?: { isFollowing?: boolean },
    ) {
      const creatorStore = getRoot(self).creatorsStore as CreatorsStore
      const creator = creatorStore.createCreatorFromLikerID(likerID)
      if (options?.isFollowing !== undefined) {
        creatorStore.creatorsFollowStore.update(
          creator.likerID,
          options.isFollowing,
        )
      }
      return creator
    },
  },
})
