import * as React from "react"
import { createStackNavigator, createBottomTabNavigator } from "react-navigation"
import { Icon } from "react-native-ui-kitten"

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
    showLabel: false,
  },
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: (props) => {
      let name: string
      switch (navigation.state.routeName) {
        case "Reader":
          name = "book-open"
          break
        case "Settings":
          name = "settings-2"
          break
      }
      if (name && !props.focused) {
        name = `${name}-outline`
      }
      const fill = props.focused ? color.palette.likeCyan : color.palette.lightGrey
      return (
        <Icon
          name={name}
          width={24}
          height={24}
          fill={fill}
        />
      )
    },
  }),
})

export const AppNavigator = createStackNavigator({
  Main: MainTabs,
  ContentView: ContentViewScreen,
}, {
  mode: "modal",
  headerMode: "none",
})
