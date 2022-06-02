import { createStackNavigator } from "react-navigation-stack"

import { BookmarksNavigator } from "./bookmarks-navigator"
import { ExperimentalFeatureScreen } from "../screens/experimental-feature-screen"
import { FollowSettingsScreen } from "../screens/follow-settings-screen"
import { LanguageSettingsScreen } from "../screens/language-settings-screen"
import { ProfileSettingsScreen } from "../screens/profile-settings-screen"
import { SettingsScreen } from "../screens/settings-screen"
import { WalletConnectListScreen } from "../screens/wallet-connect-list-screen"
import { WebsiteSignInWebviewScreen } from "../screens/website-signin-webview-screen"

export const SettingsNavigator = createStackNavigator({
  Bookmark: BookmarksNavigator,
  ExperimentalFeatures: ExperimentalFeatureScreen,
  FollowSettings: FollowSettingsScreen,
  LanguageSettings: LanguageSettingsScreen,
  ProfileSettings: ProfileSettingsScreen,
  Settings: SettingsScreen,
  WalletConnectSettings: WalletConnectListScreen,
  WebsiteSignInWebview: WebsiteSignInWebviewScreen,
}, {
  headerMode: "none",
  initialRouteName: "Settings",
})
