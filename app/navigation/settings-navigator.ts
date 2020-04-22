import { createStackNavigator } from "react-navigation"

import { WalletNavigator } from "./wallet-navigator"

import { FollowSettingsScreen } from "../screens/follow-settings-screen"
import {
  StatisticsSupportedScreen,
  StatisticsRewardedScreen,
} from "../screens/statistics-screen"
import { ReferralScreen } from "../screens/referral-screen"
import { SettingsScreen } from "../screens/settings-screen"
import { SubscriptionScreen } from "../screens/subscription-screen"

export const SettingsNavigator = createStackNavigator({
  FollowSettings: FollowSettingsScreen,
  Referral: ReferralScreen,
  Settings: SettingsScreen,
  StatisticsSupported: StatisticsSupportedScreen,
  StatisticsRewarded: StatisticsRewardedScreen,
  Subscription: SubscriptionScreen,
  Wallet: WalletNavigator,
}, {
  headerMode: "none",
  initialRouteName: "Settings",
})
