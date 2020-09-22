import { getRoot, IStateTreeNode } from "mobx-state-tree"

import { LanguageSettingsStore } from "../language-settings-store"

/**
 * Adds a languageSettingsStore property to the node for a convenient
 * and strongly typed way for stores to access other stores.
 */
export const withLanguageSettingsStore = (self: IStateTreeNode) => ({
  views: {
    /**
     * The language settings store.
     */
    get languageSettingsStore() {
      return getRoot(self).languageSettingsStore as LanguageSettingsStore
    },
    get activeLanguageKey() {
      return this.languageSettingsStore.activeLanguageKey
    },
  },
})
