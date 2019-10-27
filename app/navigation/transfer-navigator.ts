import { createStackNavigator } from "react-navigation"

import { TransferAmountInputScreen } from "../screens/transfer-amount-input-screen"
import { TransferTargetInputScreen } from "../screens/transfer-target-input-screen"

export const TransferNavigator = createStackNavigator({
  TransferAmountInput: TransferAmountInputScreen,
  TransferTargetInput: TransferTargetInputScreen,
}, {
  headerMode: "none",
  initialRouteName: "TransferTargetInput",
})
