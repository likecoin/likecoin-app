import { createStackNavigator } from "react-navigation"
import { SignInScreen } from "../screens/sign-in-screen";

export const AuthNavigator = createStackNavigator(
  {
    SignIn: { screen: SignInScreen },
  },
  {
    headerMode: "none",
  },
)
