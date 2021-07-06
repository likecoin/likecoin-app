import { createStackNavigator } from "react-navigation-stack"

import { TransferAmountInputScreen } from "../screens/transfer-amount-input-screen"
import { TransferMemoInputScreen } from "../screens/transfer-memo-input-screen"
import { TransferTargetInputScreen } from "../screens/transfer-target-input-screen"
import { TransferSigningScreen } from "../screens/transfer-signing-screen"

export const TransferNavigator = createStackNavigator({
  TransferAmountInput: TransferAmountInputScreen,
  TransferMemoInput: TransferMemoInputScreen,
  TransferTargetInput: TransferTargetInputScreen,
  TransferSigning: TransferSigningScreen,
}, {
  defaultNavigationOptions: {
    gestureEnabled: false,
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
