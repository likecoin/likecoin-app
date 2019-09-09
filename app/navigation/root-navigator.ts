import { createAppContainer, createSwitchNavigator } from "react-navigation"
import { PrimaryNavigator } from "./primary-navigator"
import { AuthNavigator } from "./auth-navigator";
import { AuthLoadingScreen } from "../screens/auth-loading-screen";

export const RootNavigator = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: PrimaryNavigator,
      Auth: AuthNavigator
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
)
