import { createStackNavigator } from "react-navigation"

import { ValidatorScreen } from "../screens/validator-screen"
import { WalletDashboardScreen } from "../screens/wallet-dashboard-screen"

export const WalletNavigator = createStackNavigator({
  Dashboard: WalletDashboardScreen,
  Validator: ValidatorScreen,
}, {
  headerMode: "none",
})
