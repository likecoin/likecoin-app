import * as React from "react"
import {
  createStackNavigator,
  createBottomTabNavigator,
} from "react-navigation"

import { BookmarksNavigator } from "./bookmarks-navigator"
import { ReaderNavigator } from "./reader-navigator"
import { SettingsNavigator } from "./settings-navigator"
import { TransferNavigator } from "./transfer-navigator"
import { StakingDelegationNavigator } from "./staking-delegation-navigator"
import { StakingRedelegationNavigator } from "./staking-redelegation-navigator"
import { StakingUnbondingDelegationNavigator } from "./staking-unbonding-delegation-navigator"

import { MainTabBarIcon } from "../components/main-tab-bar"

import { ContentViewScreen } from "../screens/content-view-screen"
import { CrispSupportScreen } from "../screens/crisp-support-screen"
// import { NotificationScreen } from "../screens/notification-screen"
import { ReferrerFollowScreen } from "../screens/referrer-follow-screen"
import { QrcodeScannerScreen } from "../screens/qrcode-scanner-screen"
import { ReceiveScreen } from "../screens/receive-screen"
import { StakingRewardsWithdrawScreen } from "../screens/staking-rewards-withdraw-screen"

import { color } from "../theme"

const MainTabs = createBottomTabNavigator({
  Reader: ReaderNavigator,
  Bookmark: BookmarksNavigator,
  // Notification: NotificationScreen,
  Settings: SettingsNavigator,
}, {
  initialRouteName: "Settings",
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
  CrispSupport: CrispSupportScreen,
  QRCodeScan: QrcodeScannerScreen,
  Receive: ReceiveScreen,
  ReferrerFollow: ReferrerFollowScreen,
  StakingDelegation: StakingDelegationNavigator,
  StakingRedelegation: StakingRedelegationNavigator,
  StakingUnbondingDelegation: StakingUnbondingDelegationNavigator,
  StakingRewardsWithdraw: StakingRewardsWithdrawScreen,
  Transfer: TransferNavigator,
}, {
  mode: "modal",
  headerMode: "none",
  initialRouteName: "Main",
})
