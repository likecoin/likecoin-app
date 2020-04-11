import { getRoot, IStateTreeNode } from "mobx-state-tree"
import { ReaderStore } from "../reader-store"

/**
 * Adds a readerStore property to the node for a convenient
 * and strongly typed way for stores to access other stores.
 */
export const withReaderStore = (self: IStateTreeNode) => ({
  views: {
    /**
     * The reader store.
     */
    get readerStore() {
      return getRoot(self).readerStore as ReaderStore
    },
  },
})
