import { createStackNavigator } from "react-navigation"

import { FollowSettingsScreen } from "../screens/follow-settings-screen"
import { SettingsScreen } from "../screens/settings-screen"
import { SubscriptionScreen } from "../screens/subscription-screen"
import { WalletNavigator } from "./wallet-navigator"

export const SettingsNavigator = createStackNavigator({
  FollowSettings: FollowSettingsScreen,
  Settings: SettingsScreen,
  Subscription: SubscriptionScreen,
  Wallet: WalletNavigator,
}, {
  headerMode: "none",
  initialRouteName: "Settings",
})
