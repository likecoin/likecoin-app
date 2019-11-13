import { createStackNavigator } from "react-navigation"
import { SettingsScreen } from "../screens/settings-screen"

export const SettingsNavigator = createStackNavigator({
  Settings: SettingsScreen,
})
