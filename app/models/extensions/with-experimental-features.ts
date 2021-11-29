import { getRoot, IStateTreeNode } from "mobx-state-tree"

import { ExperimentalFeatureStore } from "../experimental-feature-store"

/**
 * Adds a experimentalFeatures property to the node for a convenient
 * and strongly typed way for stores to access other stores.
 */
export const withExperimentalFeatures = (self: IStateTreeNode) => ({
  views: {
    /**
     * The experimental features store.
     */
    get experimentalFeatures() {
      return getRoot(self).experimentalFeatureStore as ExperimentalFeatureStore
    },
  },
})
