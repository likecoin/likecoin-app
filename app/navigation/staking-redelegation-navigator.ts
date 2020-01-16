import { createStackNavigator } from "react-navigation"

import { StakingRedelegationValidatorInputScreen } from "../screens/staking-redelegation-validator-input-screen"

export const StakingRedelegationNavigator = createStackNavigator({
  StakingRedelegationValidatorInput: StakingRedelegationValidatorInputScreen,
}, {
  defaultNavigationOptions: {
    gesturesEnabled: false,
  },
  headerMode: "none",
  initialRouteName: "StakingRedelegationValidatorInput",
})
