import { createStackNavigator } from "react-navigation"

import { StakingDelegationAmountInputScreen } from "../screens/staking-delegation-amount-input-screen"
import { StakingDelegationSigningScreen } from "../screens/staking-delegation-signing-screen"

export const StakingDelegationNavigator = createStackNavigator({
  StakingDelegationAmountInput: StakingDelegationAmountInputScreen,
  StakingDelegationSigning: StakingDelegationSigningScreen,
}, {
  headerMode: "none",
  initialRouteName: "StakingDelegationAmountInput",
})
