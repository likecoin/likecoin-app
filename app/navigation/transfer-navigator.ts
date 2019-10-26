import { createStackNavigator } from "react-navigation"

import { TransferTargetInputScreen } from "../screens/transfer-target-input-screen"

export const TransferNavigator = createStackNavigator({
  TransferTargetInput: TransferTargetInputScreen,
}, {
  headerMode: "none",
})
