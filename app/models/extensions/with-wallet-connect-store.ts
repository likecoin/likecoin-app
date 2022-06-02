import { getRoot, IStateTreeNode } from "mobx-state-tree"

import { WalletConnectStore } from "../wallet-connect-store"

/**
 * Adds a walletConnectStore property to the node for a convenient
 * and strongly typed way for stores to access other stores.
 */
export const withWalletConnectStore = (self: IStateTreeNode) => ({
  views: {
    /**
     * The wallet connect store.
     */
    get walletConnectStore() {
      return getRoot(self).walletConnectStore as WalletConnectStore
    },
  },
})
