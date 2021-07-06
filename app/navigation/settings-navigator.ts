import { createStackNavigator } from "react-navigation"

import { FollowSettingsScreen } from "../screens/follow-settings-screen"
import { LanguageSettingsScreen } from "../screens/language-settings-screen"
import { ProfileSettingsScreen } from "../screens/profile-settings-screen"
import { SettingsScreen } from "../screens/settings-screen"
import { WebsiteSignInWebviewScreen } from "../screens/website-signin-webview-screen"

export const SettingsNavigator = createStackNavigator({
  FollowSettings: FollowSettingsScreen,
  LanguageSettings: LanguageSettingsScreen,
  ProfileSettings: ProfileSettingsScreen,
  Settings: SettingsScreen,
  WebsiteSignInWebview: WebsiteSignInWebviewScreen,
}, {
  headerMode: "none",
  initialRouteName: "Settings",
})
