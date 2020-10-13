import { getRoot, IStateTreeNode } from "mobx-state-tree"

import { UserAppMeta } from "../user-app-meta"

/**
 * Adds a userAppMeta property to the node for a convenient
 * and strongly typed way for stores to access other stores.
 */
export const withUserAppMeta = (self: IStateTreeNode) => ({
  views: {
    /**
     * The user app meta store.
     */
    get userAppMeta() {
      return getRoot(self).userStore.appMeta as UserAppMeta
    },
  },
})
