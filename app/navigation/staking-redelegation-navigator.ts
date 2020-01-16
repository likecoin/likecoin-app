import { createStackNavigator } from "react-navigation"

import { StakingRedelegationValidatorInputScreen } from "../screens/staking-redelegation-validator-input-screen"
import { StakingRedelegationAmountInputScreen } from "../screens/staking-redelegation-amount-input-screen"

export const StakingRedelegationNavigator = createStackNavigator({
  StakingRedelegationValidatorInput: StakingRedelegationValidatorInputScreen,
  StakingRedelegationAmountInput: StakingRedelegationAmountInputScreen,
}, {
  defaultNavigationOptions: {
    gesturesEnabled: false,
  },
  headerMode: "none",
  initialRouteName: "StakingRedelegationValidatorInput",
})
