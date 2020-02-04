import { createStackNavigator } from "react-navigation"

import {
  AuthcoreSettingsTabs as AuthcoreSettings,
} from "./authcore-settings-navigator"
import { WalletNavigator } from "./wallet-navigator"
import { SettingsScreen } from "../screens/settings-screen"
import { SubscriptionScreen } from "../screens/subscription-screen"

export const SettingsNavigator = createStackNavigator({
  AuthcoreSettings,
  Settings: SettingsScreen,
  Subscription: SubscriptionScreen,
  Wallet: WalletNavigator,
}, {
  headerMode: "none",
  initialRouteName: "Settings",
})
