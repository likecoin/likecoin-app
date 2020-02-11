import { createStackNavigator } from "react-navigation"
import { SettingsScreen } from "../screens/settings-screen"
import { SubscriptionScreen } from "../screens/subscription-screen"
import { WalletNavigator } from "./wallet-navigator"

export const SettingsNavigator = createStackNavigator({
  Settings: SettingsScreen,
  Subscription: SubscriptionScreen,
  Wallet: WalletNavigator,
}, {
  headerMode: "none",
  initialRouteName: "Settings",
})
