import { getRoot, IStateTreeNode } from "mobx-state-tree"

import { CreatorsFollowStore } from "../creators-follow-store"

/**
 * Adds a creatorsFollowStore property to the node for a convenient
 * and strongly typed way for stores to access other stores.
 */
export const withCreatorsFollowStore = (self: IStateTreeNode) => ({
  views: {
    /**
     * The creators follow store.
     */
    get creatorsFollowStore() {
      return getRoot(self).creatorsFollowStore as CreatorsFollowStore
    },
  },
})
