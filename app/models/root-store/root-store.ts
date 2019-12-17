import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { withEnvironment } from "../extensions"
import { ChainStoreModel } from "../chain-store"
import { ReaderStoreModel } from "../reader-store"
import { StakingRewardsWithdrawStoreModel } from "../staking-rewards-withdraw-store"
import { StakingDelegationStoreModel } from "../staking-delegation-store"
import { StakingUnbondingDelegationStoreModel } from "../staking-unbonding-delegation-store"
import { TransferStoreModel } from "../transfer-store"
import { UserStoreModel } from "../user-store"

import { NavigationStoreModel } from "../../navigation/navigation-store"

// eslint-disable-next-line no-useless-escape
const URL_REGEX = /^https?:\/\/?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/

/**
 * An RootStore model.
 */
export const RootStoreModel = types
  .model("RootStore")
  .props({
    chainStore: types.maybe(ChainStoreModel),
    stakingRewardsWithdrawStore: types.optional(StakingRewardsWithdrawStoreModel, {}),
    stakingDelegationStore: types.optional(StakingDelegationStoreModel, {}),
    stakingUnbondingDelegationStore: types.optional(StakingUnbondingDelegationStoreModel, {}),
    transferStore: types.optional(TransferStoreModel, {}),
    readerStore: types.optional(ReaderStoreModel, {}),
    navigationStore: types.optional(NavigationStoreModel, {}),
    userStore: types.optional(UserStoreModel, {}),
    /**
     * The URL of the deep link to be used later
     */
    deferredDeepLink: types.maybe(types.string),
  })
  .extend(withEnvironment)
  .views(self => ({
    get isDeprecatedAppVersion() {
      return self.env.appConfig.getIsDeprecatedAppVersion()
    },
  }))
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
