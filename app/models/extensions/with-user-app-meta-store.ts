import { getRoot, IStateTreeNode } from "mobx-state-tree"

import { UserAppMetaStore } from "../user-app-meta"

/**
 * Adds a userAppMetaStore property to the node for a convenient
 * and strongly typed way for stores to access other stores.
 */
export const withUserAppMetaStore = (self: IStateTreeNode) => ({
  views: {
    /**
     * The user app meta store.
     */
    get userAppMetaStore() {
      return getRoot(self).userStore.appMeta as UserAppMetaStore
    },
  },
})
