import { createStackNavigator } from "react-navigation"

import { SignInScreen } from "../screens/sign-in-screen"
import { RegistrationScreen } from "../screens/registration-screen"
import { LikerLandOAuthScreen } from "../screens/likerland-oauth-screen"

export const AuthNavigator = createStackNavigator(
  {
    SignIn: { screen: SignInScreen },
    Register: { screen: RegistrationScreen },
    LikerLandOAuth: { screen: LikerLandOAuthScreen }
  },
  {
    headerMode: "none",
    initialRouteName: "SignIn",
  },
)
