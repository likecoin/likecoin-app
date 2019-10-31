import { createStackNavigator } from "react-navigation"

import { TransferAmountInputScreen } from "../screens/transfer-amount-input-screen"
import { TransferTargetInputScreen } from "../screens/transfer-target-input-screen"
import { TransferSigningScreen } from "../screens/transfer-signing-screen"

export const TransferNavigator = createStackNavigator({
  TransferAmountInput: TransferAmountInputScreen,
  TransferTargetInput: TransferTargetInputScreen,
  TransferSigning: TransferSigningScreen,
}, {
  headerMode: "none",
  initialRouteName: "TransferTargetInput",
})
