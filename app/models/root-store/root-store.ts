import { Alert } from "react-native"
import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import { withEnvironment } from "../extensions"
import { ChainStoreModel } from "../chain-store"
import { ContentsStoreModel } from "../contents-store"
import { ContentBookmarksStoreModel } from "../content-bookmarks-store"
import { ContentBookmarksListStoreModel } from "../content-bookmarks-list-store"
import { CreatorsFollowStoreModel } from "../creators-follow-store"
import { CreatorsStoreModel } from "../creators-store"
import { DeepLinkHandleStoreModel } from "../deep-link-handle-store"
import { LanguageSettingsStoreModel } from "../language-settings-store"
import { NotificationStoreModel } from "../notification-store"
import { StakingRewardsWithdrawStoreModel } from "../staking-rewards-withdraw-store"
import { StakingDelegationStoreModel } from "../staking-delegation-store"
import { StakingRedelegationStoreModel } from "../staking-redelegation-store"
import { StakingUnbondingDelegationStoreModel } from "../staking-unbonding-delegation-store"
import {
  StatisticsRewardedStoreModel,
  StatisticsSupportedStoreModel,
} from "../statistics-store"
import { SuperLikeFollowingStoreModel } from "../super-like-following-store"
import { SuperLikeGlobalStoreModel } from "../super-like-global-store"
import { SupportersStoreModel } from "../supporters-store"
import { TransferStoreModel } from "../transfer-store"
import { UserStoreModel } from "../user-store"

import { translate } from "../../i18n"
import { NavigationStoreModel } from "../../navigation/navigation-store"

import { logAnalyticsEvent } from "../../utils/analytics"

/**
 * An RootStore model.
 */
export const RootStoreModel = types
  .model("RootStore")
  .props({
    chainStore: types.maybe(ChainStoreModel),
    contentBookmarksStore: types.optional(ContentBookmarksStoreModel, {}),
    contentBookmarksListStore: types.optional(
      ContentBookmarksListStoreModel,
      {},
    ),
    contentsStore: types.optional(ContentsStoreModel, {}),
    creatorsStore: types.optional(CreatorsStoreModel, {}),
    creatorsFollowStore: types.optional(CreatorsFollowStoreModel, {}),
    deepLinkHandleStore: types.optional(DeepLinkHandleStoreModel, {}),
    languageSettingsStore: types.optional(LanguageSettingsStoreModel, {}),
    notificationStore: types.optional(NotificationStoreModel, {}),
    stakingRewardsWithdrawStore: types.optional(
      StakingRewardsWithdrawStoreModel,
      {},
    ),
    stakingDelegationStore: types.optional(StakingDelegationStoreModel, {}),
    stakingRedelegationStore: types.optional(StakingRedelegationStoreModel, {}),
    stakingUnbondingDelegationStore: types.optional(
      StakingUnbondingDelegationStoreModel,
      {},
    ),
    statisticsRewardedStore: types.optional(StatisticsRewardedStoreModel, {}),
    statisticsSupportedStore: types.optional(StatisticsSupportedStoreModel, {}),
    superLikeFollowingStore: types.optional(SuperLikeFollowingStoreModel, {}),
    supportersStore: types.optional(SupportersStoreModel, {}),
    superLikeGlobalStore: types.optional(SuperLikeGlobalStoreModel, {}),
    transferStore: types.optional(TransferStoreModel, {}),
    navigationStore: types.optional(NavigationStoreModel, {}),
    userStore: types.optional(UserStoreModel, {}),
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
    /**
     * Reset user related stores
     */
    reset: flow(function*() {
      self.isShowUnauthenticatedAlert = false
      self.navigationStore.navigateTo("Auth")
      self.creatorsFollowStore.reset()
      self.contentBookmarksStore.reset()
      self.stakingRewardsWithdrawStore.reset()
      self.stakingDelegationStore.reset()
      self.stakingRedelegationStore.reset()
      self.stakingUnbondingDelegationStore.reset()
      self.statisticsRewardedStore.reset()
      self.statisticsSupportedStore.reset()
      self.superLikeFollowingStore.reset()
      self.transferStore.reset()
    }),
  }))
  .actions(self => ({
    handleUnauthenticatedError(type: string, error: any) {
      logAnalyticsEvent("UnauthenticatedError", {
        type,
        error: error.toString(),
      })
      if (self.isShowUnauthenticatedAlert) return
      self.isShowUnauthenticatedAlert = true
      Alert.alert(
        translate("UnauthenticatedAlert.title", { type }),
        translate("UnauthenticatedAlert.message"),
        [
          {
            text: translate("common.confirm"),
            onPress: self.reset,
          },
        ],
        { cancelable: false },
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
