import { createStackNavigator } from "react-navigation"

import { SignInScreen } from "../screens/sign-in-screen"
import { RegisterScreen } from "../screens/register-screen"
import { LikerLandOAuthScreen } from "../screens/likerland-oauth-screen"

export const AuthNavigator = createStackNavigator(
  {
    SignIn: { screen: SignInScreen },
    Register: { screen: RegisterScreen },
    LikerLandOAuth: { screen: LikerLandOAuthScreen }
  },
  {
    headerMode: "none",
    initialRouteName: "SignIn",
  },
)
