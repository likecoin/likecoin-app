import * as React from "react"
import {
  createStackNavigator,
  createBottomTabNavigator,
} from "react-navigation"

import { ReaderNavigator } from "./reader-navigator"
import { SettingsNavigator } from "./settings-navigator"
import { TransferNavigator } from "./transfer-navigator"
import { StakingDelegationNavigator } from "./staking-delegation-navigator"
import { StakingRedelegationNavigator } from "./staking-redelegation-navigator"
import { StakingUnbondingDelegationNavigator } from "./staking-unbonding-delegation-navigator"

import { MainTabBarIcon } from "../components/main-tab-bar"

import { BookmarkScreen } from "../screens/bookmark-screen"
import { ContentViewScreen } from "../screens/content-view-screen"
import { QrcodeScannerScreen } from "../screens/qrcode-scanner-screen"
import { ReceiveScreen } from "../screens/receive-screen"
import { StakingRewardsWithdrawScreen } from "../screens/staking-rewards-withdraw-screen"
import { ValidatorScreen } from "../screens/validator-screen"
import { CrispSupportScreen } from "../screens/crisp-support-screen"

import { color } from "../theme"

const MainTabs = createBottomTabNavigator({
  Reader: ReaderNavigator,
  Bookmark: BookmarkScreen,
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
      <MainTabBarIcon
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
  StakingRedelegation: StakingRedelegationNavigator,
  StakingUnbondingDelegation: StakingUnbondingDelegationNavigator,
  StakingRewardsWithdraw: StakingRewardsWithdrawScreen,
  Transfer: TransferNavigator,
  Validator: ValidatorScreen,
  CrispSupport: CrispSupportScreen,
}, {
  mode: "modal",
  headerMode: "none",
  initialRouteName: "Main",
})
