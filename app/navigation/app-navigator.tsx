import * as React from "react"
import { createStackNavigator, createBottomTabNavigator } from "react-navigation"
import { Icon } from "react-native-ui-kitten"

import { WalletNavigator } from "./wallet-navigator"
import { ReaderNavigator } from "./reader-navigator"
import { SettingsNavigator } from "./settings-navigator"
import { TransferNavigator } from "./transfer-navigator"
import { ContentViewScreen } from "../screens/content-view-screen"
import { ReceiveScreen } from "../screens/receive-screen"
import { ValidatorScreen } from "../screens/validator-screen"
import { color } from "../theme"

const MainTabs = createBottomTabNavigator({
  Wallet: WalletNavigator,
  Reader: ReaderNavigator,
  Settings: SettingsNavigator,
}, {
  initialRouteName: "Wallet",
  tabBarOptions: {
    activeTintColor: color.primary,
    showLabel: false,
  },
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: (props) => {
      let name: string
      switch (navigation.state.routeName) {
        case "Wallet":
          name = "briefcase"
          break
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
  Receive: ReceiveScreen,
  Transfer: TransferNavigator,
  Validator: ValidatorScreen,
}, {
  mode: "modal",
  headerMode: "none",
  initialRouteName: "Main",
})
