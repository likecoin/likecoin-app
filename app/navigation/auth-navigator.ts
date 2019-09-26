import { createStackNavigator } from "react-navigation"
import { SignInScreen } from "../screens/sign-in-screen";
import { LikerLandOAuthScreen } from "../screens/likerland-oauth-screen";
import { AuthCoreAuthScreen} from "../screens/authcore-auth-screen";

export const AuthNavigator = createStackNavigator(
  {
    AuthCoreAuth: { screen: AuthCoreAuthScreen },
    SignIn: { screen: SignInScreen },
    LikerLandOAuth: { screen: LikerLandOAuthScreen }
  },
  {
    headerMode: "none",
    initialRouteName: "SignIn",
  },
)
