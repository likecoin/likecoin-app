import * as React from "react"
import { createStackNavigator } from "react-navigation-stack"
import {
  createBottomTabNavigator,
  BottomTabBar,
} from "react-navigation-tabs"

import { DashboardNavigator } from "./dashboard-navigator"
import { SettingsNavigator } from "./settings-navigator"
import { StakingDelegationNavigator } from "./staking-delegation-navigator"
import { StakingRedelegationNavigator } from "./staking-redelegation-navigator"
import { StakingUnbondingDelegationNavigator } from "./staking-unbonding-delegation-navigator"
import { TransferNavigator } from "./transfer-navigator"

import { MainTabBarIcon } from "../components/main-tab-bar"

import { ContentViewScreen } from "../screens/content-view-screen"
import { CrispSupportScreen } from "../screens/crisp-support-screen"
import { NFTReaderScreen } from "../screens/nft-reader-screen/nft-reader-screen"
// import { NotificationScreen } from "../screens/notification-screen"
import { ReferrerFollowScreen } from "../screens/referrer-follow-screen"
import { QrcodeScannerScreen } from "../screens/qrcode-scanner-screen"
import { ReceiveScreen } from "../screens/receive-screen"
import { ReaderScreen } from "../screens/reader-screen"
import { StakingRewardsWithdrawScreen } from "../screens/staking-rewards-withdraw-screen"
import { WalletConnectRequestScreen } from "../screens/wallet-connect-request-screen"

import { color } from "../theme"

const MainTabs = createBottomTabNavigator({
  Dashboard: DashboardNavigator,
  NFT: NFTReaderScreen,
  Reader: ReaderScreen,
  // Notification: NotificationScreen,
  Settings: SettingsNavigator,
}, {
  initialRouteName: "Dashboard",
  tabBarOptions: {
    activeTintColor: color.primary,
    showLabel: false,
  },
  // eslint-disable-next-line react/display-name
  tabBarComponent: (props) => (
    <BottomTabBar {...props} />
  ),
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
  WalletConnect: WalletConnectRequestScreen,
}, {
  headerMode: "none",
  initialRouteName: "Main",
})
