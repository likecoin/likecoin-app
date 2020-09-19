import { getRoot, IStateTreeNode } from "mobx-state-tree"

import { Content } from "../../services/api/api.types"
import { ContentsStore } from "../contents-store"

/**
 * Adds a contentsStore property to the node for a convenient
 * and strongly typed way for stores to access other stores.
 */
export const withContentsStore = (self: IStateTreeNode) => ({
  views: {
    /**
     * The contents store.
     */
    get contentsStore() {
      return getRoot(self).contentsStore as ContentsStore
    },
  },
  actions: {
    createContentFromData(data: Content) {
      return (getRoot(self).contentsStore as ContentsStore).createItemFromData(data)
    },
    createContentFromURL(url: string) {
      return (getRoot(self).contentsStore as ContentsStore).createItemFromURL(url)
    },
  },
})
