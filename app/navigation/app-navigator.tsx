import * as React from "react"
import {
  createStackNavigator,
  createBottomTabNavigator,
  TabBarIconProps,
} from "react-navigation"
import { Icon } from "react-native-ui-kitten"

import { ReaderNavigator } from "./reader-navigator"
import { SettingsNavigator } from "./settings-navigator"
import { ContentViewScreen } from "../screens/content-view-screen"
import { color } from "../theme"

export interface CustomTabBarIcon extends TabBarIconProps {
  routeName: string
}
export function CustomTabBarIcon(props: CustomTabBarIcon) {
  let name: string
  switch (props.routeName) {
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
}
CustomTabBarIcon.displayName = 'CustomTabBarIcon'

const MainTabs = createBottomTabNavigator({
  Reader: ReaderNavigator,
  Settings: SettingsNavigator,
}, {
  tabBarOptions: {
    activeTintColor: color.primary,
    showLabel: false,
  },
  defaultNavigationOptions: ({ navigation }) => ({
    // eslint-disable-next-line react/display-name
    tabBarIcon: (props) => (
      <CustomTabBarIcon
        {...props}
        routeName={navigation.state.routeName}
      />
    ),
  }),
})

export const AppNavigator = createStackNavigator({
  Main: MainTabs,
  ContentView: ContentViewScreen,
}, {
  mode: "modal",
  headerMode: "none",
})
