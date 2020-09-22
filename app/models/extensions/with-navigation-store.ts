import { getRoot, IStateTreeNode } from "mobx-state-tree"

import { NavigationStore } from "../../navigation/navigation-store"

/**
 * Adds a navigationStore property to the node for a convenient
 * and strongly typed way for stores to access other stores.
 */
export const withNavigationStore = (self: IStateTreeNode) => ({
  views: {
    /**
     * The navigation store.
     */
    get navigationStore() {
      return getRoot(self).navigationStore as NavigationStore
    },
  },
})
