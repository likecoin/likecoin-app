import { createStackNavigator } from "react-navigation-stack"

import { BookmarksNavigator } from "./bookmarks-navigator"
import { AccountDeleteScreen } from "../screens/account-delete-screen"
import { ExperimentalFeatureScreen } from "../screens/experimental-feature-screen"
import { LanguageSettingsScreen } from "../screens/language-settings-screen"
import { ProfileSettingsScreen } from "../screens/profile-settings-screen"
import { SettingsScreen } from "../screens/settings-screen"
import { WalletConnectListScreen } from "../screens/wallet-connect-list-screen"
import { WebsiteSignInWebviewScreen } from "../screens/website-signin-webview-screen"

export const SettingsNavigator = createStackNavigator({
  AccountDelete: AccountDeleteScreen,
  Bookmark: BookmarksNavigator,
  ExperimentalFeatures: ExperimentalFeatureScreen,
  LanguageSettings: LanguageSettingsScreen,
  ProfileSettings: ProfileSettingsScreen,
  Settings: SettingsScreen,
  WalletConnectSettings: WalletConnectListScreen,
  WebsiteSignInWebview: WebsiteSignInWebviewScreen,
}, {
  headerMode: "none",
  initialRouteName: "Settings",
})
