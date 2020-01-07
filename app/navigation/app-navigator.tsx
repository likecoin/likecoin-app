import * as React from "react"
import {
  createStackNavigator,
  createBottomTabNavigator,
  TabBarIconProps,
} from "react-navigation"

import { Icon, IconTypes } from "../components/icon"

import { WalletNavigator } from "./wallet-navigator"
import { ReaderNavigator } from "./reader-navigator"
import { SettingsNavigator } from "./settings-navigator"
import { TransferNavigator } from "./transfer-navigator"
import { StakingDelegationNavigator } from "./staking-delegation-navigator"
import { StakingUnbondingDelegationNavigator } from "./staking-unbonding-delegation-navigator"

import { BookmarkScreen } from "../screens/bookmark-screen"
import { ContentViewScreen } from "../screens/content-view-screen"
import { QrcodeScannerScreen } from "../screens/qrcode-scanner-screen"
import { ReceiveScreen } from "../screens/receive-screen"
import { StakingRewardsWithdrawScreen } from "../screens/staking-rewards-withdraw-screen"
import { ValidatorScreen } from "../screens/validator-screen"

import { color } from "../theme"

export interface CustomTabBarIconProps extends TabBarIconProps {
  routeName: string
}
export function CustomTabBarIcon(props: CustomTabBarIconProps) {
  let name: IconTypes
  let size = 24
  switch (props.routeName) {
    case "Wallet":
      name = "tab-wallet"
      break
    case "Reader":
      name = "tab-reader"
      size = 32
      break
    case "Bookmark":
      name = "tab-bookmark"
      break
    case "Settings":
      name = "tab-settings"
      break
  }
  const fill = props.focused ? color.palette.likeCyan : color.palette.lightGrey
  return (
    <Icon
      name={name}
      width={size}
      height={size}
      fill={fill}
    />
  )
}
CustomTabBarIcon.displayName = 'CustomTabBarIcon'

const MainTabs = createBottomTabNavigator({
  Reader: ReaderNavigator,
  Bookmark: BookmarkScreen,
  Wallet: WalletNavigator,
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
  StakingUnbondingDelegation: StakingUnbondingDelegationNavigator,
  StakingRewardsWithdraw: StakingRewardsWithdrawScreen,
  Transfer: TransferNavigator,
  Validator: ValidatorScreen,
}, {
  mode: "modal",
  headerMode: "none",
  initialRouteName: "Main",
})
