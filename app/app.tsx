// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import * as React from "react"
import {
  Alert,
  AppRegistry,
  Linking,
  Platform,
} from "react-native"
import { enableScreens } from "react-native-screens"
import RNExitApp from "react-native-exit-app"
import { INIT_APP_TIMEOUT } from "react-native-dotenv"

import { Provider } from "mobx-react"
import { contains } from "ramda"
import { ThemeProvider } from "styled-components/native"

import { translate } from "./i18n"
import { logError } from "./utils/error"
import { defaultTheme } from "./theme/styled"

import { StatefulNavigator } from "./navigation"
import { BackButtonHandler } from "./navigation/back-button-handler"
import { DEFAULT_NAVIGATION_CONFIG } from "./navigation/navigation-config"

import { RootStore, setupRootStore } from "./models/root-store"

import { LoadingScreen } from "./components/loading-screen"

import { SaveToBookmarkScreen } from "./screens/save-to-bookmark-screen"

import { StorybookUIRoot } from "../storybook"

if (Platform.OS === "ios") {
  enableScreens()
}

interface AppState {
  rootStore?: RootStore
  languageKey?: string
}

/**
 * This is the root component of our app.
 */
export class App extends React.Component<{}, AppState> {

  initTimer?: number

  /**
   * When the component is mounted. This happens asynchronously and simply
   * re-renders when we're good to go.
   */
  async componentDidMount() {
    this.startInitTimer()
    const rootStore = await setupRootStore()
    this.setState({
      rootStore,
      languageKey: rootStore.languageSettingsStore.activeLanguageKey
    }, this.clearInitTimer)

    this.state.rootStore?.languageSettingsStore?.listenChange(
      this.handleLanguageChange,
    )

    if (this.state.rootStore?.isDeprecatedAppVersion) {
      Alert.alert("", translate("error.DEPRECATED_APP"), [{
        text: translate("common.ok"),
        onPress: () => RNExitApp.exitApp(),
      }])
      return
    }

    this.state.rootStore?.userStore.checkTrackingStatus()

    Linking.addEventListener('url', this._onOpenURL)
    try {
      const url = await Linking.getInitialURL()
      if (!url) return
      this._handleDeepLinkURL(url)
    } catch (err) {
      logError(err.message)
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._onOpenURL)
  }

  startInitTimer = () => {
    const duration = parseInt(INIT_APP_TIMEOUT) || 10000
    this.initTimer = setTimeout(() => {
      logError(new Error("INIT_FAILED"))
      Alert.alert(
        translate("initializingFailedAlertTitle"),
        translate("initializingFailedAlertMessage"),
        [
          {
            style: "cancel",
            text: translate("common.cancel"),
          },
          {
            text: translate("closeApp"),
            onPress: () => RNExitApp.exitApp(),
          },
        ]
      )
    }, duration)
  }

  clearInitTimer = () => {
    if (this.initTimer) clearTimeout(this.initTimer)
  }

  /**
   * Are we allowed to exit the app?  This is called when the back button
   * is pressed on android.
   *
   * @param routeName The currently active route name.
   */
  canExit(routeName: string) {
    return contains(routeName, DEFAULT_NAVIGATION_CONFIG.exitRoutes)
  }

  _onOpenURL = (event: { url: string }) => {
    this._handleDeepLinkURL(event.url)
  }

  _handleDeepLinkURL = (url: string) => {
    const { rootStore } = this.state
    if (rootStore?.userStore?.currentUser) {
      rootStore.deepLinkHandleStore.openDeepLink(url)
    } else {
      rootStore.deepLinkHandleStore.deferDeepLink(url)
    }
  }

  private handleLanguageChange = (languageKey: string) => {
    this.setState({ languageKey })
  }

  render() {
    const rootStore = this.state && this.state.rootStore

    // Before we show the app, we have to wait for our state to be ready.
    // In the meantime, don't render anything. This will be the background
    // color set in native by rootView's background color.
    //
    // This step should be completely covered over by the splash screen though.
    //
    // You're welcome to swap in your own component to render if your boot up
    // sequence is too slow though.
    if (!rootStore || this.state.rootStore.isDeprecatedAppVersion) {
      return <LoadingScreen tx="initializing" />
    }

    // otherwise, we're ready to render the app

    // wire stores defined in root-store.ts file
    const { navigationStore, ...otherStores } = rootStore

    return (
      <Provider rootStore={rootStore} navigationStore={navigationStore} {...otherStores}>
        <ThemeProvider theme={defaultTheme}>
          <BackButtonHandler canExit={this.canExit}>
            <StatefulNavigator key={this.state.languageKey} />
          </BackButtonHandler>
        </ThemeProvider>
      </Provider>
    )
  }
}

/**
 * This is the root component of the share extension.
 */
export class ShareExtension extends React.Component {
  render() {
    return <SaveToBookmarkScreen />
  }
}

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */
const APP_NAME = "LikeCoinApp"
const SHARE_EXTENSION_NAME = "LikerLandShare"

// Should we show storybook instead of our app?
//
// ⚠️ Leave this as `false` when checking into git.
const SHOW_STORYBOOK = false

const RootComponent = SHOW_STORYBOOK && __DEV__ ? StorybookUIRoot : App
AppRegistry.registerComponent(APP_NAME, () => RootComponent)
AppRegistry.registerComponent(SHARE_EXTENSION_NAME, () => ShareExtension)
