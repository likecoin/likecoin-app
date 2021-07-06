import { createStackNavigator } from "react-navigation-stack"

import { StakingRedelegationAmountInputScreen } from "../screens/staking-redelegation-amount-input-screen"
import { StakingRedelegationValidatorInputScreen } from "../screens/staking-redelegation-validator-input-screen"
import { StakingRedelegationSigningScreen } from "../screens/staking-redelegation-signing-screen"

export const StakingRedelegationNavigator = createStackNavigator({
  StakingRedelegationAmountInput: StakingRedelegationAmountInputScreen,
  StakingRedelegationValidatorInput: StakingRedelegationValidatorInputScreen,
  StakingRedelegationSigning: StakingRedelegationSigningScreen,
}, {
  defaultNavigationOptions: {
    gestureEnabled: false,
  },
  headerMode: "none",
  initialRouteName: "StakingRedelegationValidatorInput",
})
