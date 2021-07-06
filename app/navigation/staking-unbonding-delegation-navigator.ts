import { createStackNavigator } from "react-navigation-stack"

import { StakingUnbondingDelegationAmountInputScreen } from "../screens/staking-unbonding-delegation-amount-input-screen"
import { StakingUnbondingDelegationSigningScreen } from "../screens/staking-unbonding-delegation-signing-screen"

export const StakingUnbondingDelegationNavigator = createStackNavigator({
  StakingUnbondingDelegationAmountInput: StakingUnbondingDelegationAmountInputScreen,
  StakingUnbondingDelegationSigning: StakingUnbondingDelegationSigningScreen,
}, {
  defaultNavigationOptions: {
    gestureEnabled: false,
  },
  headerMode: "none",
  initialRouteName: "StakingUnbondingDelegationAmountInput",
})
