import { createStackNavigator } from "react-navigation-stack"

import { SignInScreen } from "../screens/sign-in-screen"
import { PostSignInScreen } from "../screens/post-sign-in-screen"
import { RegistrationScreen } from "../screens/registration-screen"
import { ReferrerInputScreen } from "../screens/referrer-input-screen"

export const AuthNavigator = createStackNavigator(
  {
    SignIn: { screen: SignInScreen },
    PostSignIn: { screen: PostSignInScreen },
    Register: { screen: RegistrationScreen },
    ReferrerInputScreen: { screen: ReferrerInputScreen }
  },
  {
    headerMode: "none",
    initialRouteName: "SignIn",
  },
)
