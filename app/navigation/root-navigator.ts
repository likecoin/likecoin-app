import { createAppContainer, createSwitchNavigator } from "react-navigation"
import { AppNavigator } from "./app-navigator"
import { AuthNavigator } from "./auth-navigator"
import { AuthLoadingScreen } from "../screens/auth-loading-screen"

export const RootNavigator = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppNavigator,
      Auth: AuthNavigator
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
)
