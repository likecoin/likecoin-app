import { getRoot, IStateTreeNode } from "mobx-state-tree"

import { ContentBookmarksStore } from "../content-bookmarks-store"

/**
 * Adds a `contentBookmarksStore` property to the node for a convenient
 * and strongly typed way for stores to access other stores.
 */
export const withContentBookmarksStore = (self: IStateTreeNode) => ({
  views: {
    /**
     * The content bookmarks store.
     */
    get contentBookmarksStore() {
      return getRoot(self).contentBookmarksStore as ContentBookmarksStore
    },
    /**
     * Check whether the content is bookmarked or not
     * @param url The cannonical URL of the content
     * @return boolean
     */
    checkIsBookmarkedURL(url: string) {
      return this.contentBookmarksStore.items.has(url)
    },
    getBookmarkByURL(url: string) {
      return this.contentBookmarksStore.items.get(url)
    }
  },
})
