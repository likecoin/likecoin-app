import { createStackNavigator } from "react-navigation-stack"

import { SignInScreen } from "../screens/sign-in-screen"
import { RegistrationScreen } from "../screens/registration-screen"
import { LikerLandOAuthScreen } from "../screens/likerland-oauth-screen"
import { ReferrerInputScreen } from "../screens/referrer-input-screen"

export const AuthNavigator = createStackNavigator(
  {
    SignIn: { screen: SignInScreen },
    Register: { screen: RegistrationScreen },
    LikerLandOAuth: { screen: LikerLandOAuthScreen },
    ReferrerInputScreen: { screen: ReferrerInputScreen }
  },
  {
    headerMode: "none",
    initialRouteName: "SignIn",
  },
)
