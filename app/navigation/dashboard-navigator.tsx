import { createStackNavigator } from "react-navigation"

import { WalletNavigator } from "./wallet-navigator"

import { DashboardScreen } from "../screens/dashboard-screen"
import { ReferralScreen } from "../screens/referral-screen"
import {
  StatisticsSupportedScreen,
  StatisticsRewardedScreen,
} from "../screens/statistics-screen"
import { SubscriptionScreen } from "../screens/subscription-screen"

export const DashboardNavigator = createStackNavigator({
  Dashboard: DashboardScreen,
  Referral: ReferralScreen,
  StatisticsSupported: StatisticsSupportedScreen,
  StatisticsRewarded: StatisticsRewardedScreen,
  Subscription: SubscriptionScreen,
  Wallet: WalletNavigator,
}, {
  headerMode: "none",
  initialRouteName: "Dashboard",
})
