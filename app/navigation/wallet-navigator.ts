import { createStackNavigator } from "react-navigation"
import { WalletDashboardScreen } from "../screens/wallet-dashboard-screen"

export const WalletNavigator = createStackNavigator({
  Dashboard: WalletDashboardScreen,
}, {
  headerMode: "none",
})