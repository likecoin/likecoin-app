import { createStackNavigator, createBottomTabNavigator } from "react-navigation"
import { ReaderNavigator } from "./reader-navigator"
import { SettingsNavigator } from "./settings-navigator"
import { ContentViewScreen } from "../screens/content-view-screen"
import { color } from "../theme"

const MainTabs = createBottomTabNavigator({
  Reader: ReaderNavigator,
  Settings: SettingsNavigator,
}, {
  tabBarOptions: {
    activeTintColor: color.primary,
  },
})

export const AppNavigator = createStackNavigator({
  Main: MainTabs,
  ContentView: ContentViewScreen,
}, {
  mode: "modal",
  headerMode: "none",
})
