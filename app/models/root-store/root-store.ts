import { WalletStoreModel } from "../../models/wallet-store"
import { ReaderStoreModel } from "../../models/reader-store"
import { UserStoreModel } from "../../models/user-store"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { NavigationStoreModel } from "../../navigation/navigation-store"

/**
 * An RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  walletStore: types.optional(WalletStoreModel, {}),
  readerStore: types.optional(ReaderStoreModel, {}),
  navigationStore: types.optional(NavigationStoreModel, {}),
  userStore: types.optional(UserStoreModel, {}),
  /**
   * The URL of the deep link to be used later
   */
  deferredDeepLink: types.maybe(types.string),
})
.actions(self => ({
  deferDeepLink(url: string) {
    self.deferredDeepLink = url
  },
  /**
   * Try to open a deep link
   * @param url The optional URL of the deep link, if not provided, the deferred deep link is used instead
   */
  openDeepLink(url: string = self.deferredDeepLink) {
    if (!url) return

    if (/https?\/\//.test(url)) {
      self.navigationStore.dispatch({
        type: "Navigation/PUSH",
        routeName: "ContentView",
        params: {
          content: self.readerStore.getContentByURL(url),
        },
      })
    }

    if (self.deferredDeepLink) {
      self.deferredDeepLink = undefined
    }
  },
}))

/**
 * The RootStore instance.
 */
export type RootStore = Instance<typeof RootStoreModel>

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = SnapshotOut<typeof RootStoreModel>
