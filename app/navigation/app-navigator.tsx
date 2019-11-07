import * as React from "react"
import {
  createStackNavigator,
  createBottomTabNavigator,
  TabBarIconProps,
} from "react-navigation"
import { Icon } from "react-native-ui-kitten"

import { WalletNavigator } from "./wallet-navigator"
import { ReaderNavigator } from "./reader-navigator"
import { SettingsNavigator } from "./settings-navigator"
import { TransferNavigator } from "./transfer-navigator"
import { StakingDelegationNavigator } from "./staking-delegation-navigator"

import { ContentViewScreen } from "../screens/content-view-screen"
import { QrcodeScannerScreen } from "../screens/qrcode-scanner-screen"
import { ReceiveScreen } from "../screens/receive-screen"
import { ValidatorScreen } from "../screens/validator-screen"

import { color } from "../theme"

export interface CustomTabBarIconProps extends TabBarIconProps {
  routeName: string
}
export function CustomTabBarIcon(props: CustomTabBarIconProps) {
  let name: string
  switch (props.routeName) {
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
}
CustomTabBarIcon.displayName = 'CustomTabBarIcon'

const MainTabs = createBottomTabNavigator({
  Wallet: WalletNavigator,
  Reader: ReaderNavigator,
  Settings: SettingsNavigator,
}, {
  initialRouteName: "Reader",
  tabBarOptions: {
    activeTintColor: color.primary,
    showLabel: false,
  },
  defaultNavigationOptions: ({ navigation }) => ({
    // eslint-disable-next-line react/display-name
    tabBarIcon: (props) => (
      <CustomTabBarIcon
        routeName={navigation.state.routeName}
        {...props}
      />
    ),
  }),
})

export const AppNavigator = createStackNavigator({
  Main: MainTabs,
  ContentView: ContentViewScreen,
  QRCodeScan: QrcodeScannerScreen,
  Receive: ReceiveScreen,
  StakingDelegation: StakingDelegationNavigator,
  Transfer: TransferNavigator,
  Validator: ValidatorScreen,
}, {
  mode: "modal",
  headerMode: "none",
  initialRouteName: "Main",
})
