import { Alert } from "react-native"
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
import { StakingRedelegationStoreModel } from "../staking-redelegation-store"
import { StakingUnbondingDelegationStoreModel } from "../staking-unbonding-delegation-store"
import { StatisticsSupportedStoreModel } from "../statistics-store"
import { TransferStoreModel } from "../transfer-store"
import { UserStoreModel } from "../user-store"

import { translate } from "../../i18n"
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
    stakingRedelegationStore: types.optional(StakingRedelegationStoreModel, {}),
    stakingUnbondingDelegationStore: types.optional(StakingUnbondingDelegationStoreModel, {}),
    statisticsSupportedStore: types.optional(StatisticsSupportedStoreModel, {}),
    transferStore: types.optional(TransferStoreModel, {}),
    readerStore: types.optional(ReaderStoreModel, {}),
    navigationStore: types.optional(NavigationStoreModel, {}),
    userStore: types.optional(UserStoreModel, {}),
    /**
     * The URL of the deep link to be used later
     */
    deferredDeepLink: types.maybe(types.string),
  })
  .volatile(() => ({
    isShowUnauthenticatedAlert: false,
  }))
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
      self.isShowUnauthenticatedAlert = false
      self.navigationStore.navigateTo("Auth")
      yield self.userStore.logout()
    }),
  }))
  .actions(self => ({
    handleUnauthenticatedError() {
      if (self.isShowUnauthenticatedAlert) return
      self.isShowUnauthenticatedAlert = true
      Alert.alert(
        translate("UnauthenticatedAlert.title"),
        translate("UnauthenticatedAlert.message"),
        [
          {
            text: translate("common.confirm"),
            onPress: self.signOut,
          }
        ],
        { cancelable: false }
      )
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
