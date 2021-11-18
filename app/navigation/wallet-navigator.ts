import { createStackNavigator } from "react-navigation-stack"

import { ValidatorScreen } from "../screens/validator-screen"
import { ValidatorListScreen } from "../screens/validator-list-screen"
import { WalletDashboardScreen } from "../screens/wallet-dashboard-screen"
import { WalletConnectListScreen } from "../screens/wallet-connect-list-screen"

export const WalletNavigator = createStackNavigator({
  Dashboard: WalletDashboardScreen,
  Validator: ValidatorScreen,
  ValidatorList: ValidatorListScreen,
  WalletConnectList: WalletConnectListScreen,
}, {
  headerMode: "none",
})
