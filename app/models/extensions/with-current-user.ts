import { getRoot, IStateTreeNode } from "mobx-state-tree"

import { User } from "../user"

/**
 * Adds current user related properties to the node for a convenient
 * and strongly typed way for stores to access other stores.
 */
export const withCurrentUser = (self: IStateTreeNode) => ({
  views: {

    get currentUser() {
      return getRoot(self).userStore.currentUser as User
    },
    get currentUserID() {
      return this.currentUser ? this.currentUser.likerID : ""
    },
  },
})
