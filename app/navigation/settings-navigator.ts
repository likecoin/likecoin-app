import { createStackNavigator } from "react-navigation"
import { SettingsScreen } from "../screens/settings-screen"
import { SubscriptionScreen } from "../screens/subscription-screen"

export const SettingsNavigator = createStackNavigator({
  Settings: SettingsScreen,
  Subscription: SubscriptionScreen,
}, {
  headerMode: "none",
  initialRouteName: "Settings",
})
