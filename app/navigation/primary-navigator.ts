import { createStackNavigator } from "react-navigation"
import { WelcomeScreen } from "../screens/welcome-screen"

export const PrimaryNavigator = createStackNavigator(
  {
    welcome: { screen: WelcomeScreen },
  },
  {
    headerMode: "none",
  },
)
