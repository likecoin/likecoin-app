import { StakingDelegationStoreModel } from "../staking-delegation-store"
import { TransferStoreModel } from "../../models/transfer-store"
import { WalletStoreModel } from "../../models/wallet-store"
import { ReaderStoreModel } from "../../models/reader-store"
import { UserStoreModel } from "../../models/user-store"
import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { NavigationStoreModel } from "../../navigation/navigation-store"

// eslint-disable-next-line no-useless-escape
const URL_REGEX = /^https?:\/\/?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/

/**
 * An RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  stakingDelegationStore: types.optional(StakingDelegationStoreModel, {}),
  transferStore: types.optional(TransferStoreModel, {}),
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

      if (URL_REGEX.test(url)) {
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

    signOut: flow(function * () {
      yield self.userStore.logout()
      self.navigationStore.navigateTo("Auth")
    }),
  }))

/**
 * The RootStore instance.
 */
export type RootStore = Instance<typeof RootStoreModel>

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = SnapshotOut<typeof RootStoreModel>
