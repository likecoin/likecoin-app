import { createStackNavigator } from "react-navigation"

import { WalletNavigator } from "./wallet-navigator"

import { FollowSettingsScreen } from "../screens/follow-settings-screen"
import { SettingsScreen } from "../screens/settings-screen"
import { SubscriptionScreen } from "../screens/subscription-screen"

export const SettingsNavigator = createStackNavigator({
  FollowSettings: FollowSettingsScreen,
  Settings: SettingsScreen,
  Subscription: SubscriptionScreen,
  Wallet: WalletNavigator,
}, {
  headerMode: "none",
  initialRouteName: "Settings",
})
