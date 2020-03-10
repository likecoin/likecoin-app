import { createStackNavigator } from "react-navigation"

import { TransferAmountInputScreen } from "../screens/transfer-amount-input-screen"
import { TransferTargetInputScreen } from "../screens/transfer-target-input-screen"
import { TransferSigningScreen } from "../screens/transfer-signing-screen"

export const TransferNavigator = createStackNavigator({
  TransferAmountInput: TransferAmountInputScreen,
  TransferTargetInput: TransferTargetInputScreen,
  TransferSigning: TransferSigningScreen,
}, {
  defaultNavigationOptions: {
    gesturesEnabled: false,
  },
  headerMode: "none",
  initialRouteName: "TransferTargetInput",
})

export interface TransferNavigatorParams {
  address: string
  amount: string
  memo: string
  likerId: string
  skipToConfirm: boolean
}
