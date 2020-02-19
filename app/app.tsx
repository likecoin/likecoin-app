// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import { translate } from "./i18n"
import * as React from "react"
import { Alert, AppRegistry, Linking, YellowBox } from "react-native"
import { mapping, light as lightTheme } from '@eva-design/eva'
import { ApplicationProvider, IconRegistry } from 'react-native-ui-kitten'
import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import RNExitApp from 'react-native-exit-app'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import { Provider } from "mobx-react"
import { contains } from "ramda"

import { StatefulNavigator } from "./navigation"
import { BackButtonHandler } from "./navigation/back-button-handler"
import { DEFAULT_NAVIGATION_CONFIG } from "./navigation/navigation-config"
import { RootStore, setupRootStore } from "./models/root-store"
import { logError } from "./utils/error"
import { LoadingScreen } from "./components/loading-screen"
import { StorybookUIRoot } from "../storybook"

/**
 * Ignore some yellowbox warnings. Some of these are for deprecated functions
 * that we haven't gotten around to replacing yet.
 */
YellowBox.ignoreWarnings([
  "componentWillMount is deprecated",
  "componentWillReceiveProps is deprecated",
])

/**
 * Storybook still wants to use ReactNative's AsyncStorage instead of the
 * react-native-community package; this causes a YellowBox warning. This hack
 * points RN's AsyncStorage at the community one, fixing the warning. Here's the
 * Storybook issue about this: https://github.com/storybookjs/storybook/issues/6078
 */
const ReactNative = require("react-native")
Object.defineProperty(ReactNative, "AsyncStorage", {
  get(): any {
    return require("@react-native-community/async-storage").default
  },
})

interface AppState {
  rootStore?: RootStore
}

/**
 * This is the root component of our app.
 */
export class App extends React.Component<{}, AppState> {
  /**
   * When the component is mounted. This happens asynchronously and simply
   * re-renders when we're good to go.
   */
  async componentDidMount() {
    this.setState({
      rootStore: await setupRootStore(),
    })

    if (this.state.rootStore.isDeprecatedAppVersion) {
      Alert.alert("", translate("error.DEPRECATED_APP"), [{
        text: translate("common.ok"),
        onPress: () => RNExitApp.exitApp(),
      }])
      return
    }

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
    const rootStore = this.state && this.state.rootStore
    if (rootStore && rootStore.userStore.currentUser) {
      rootStore.openDeepLink(url)
    } else {
      rootStore.deferDeepLink(url)
    }
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
      return <LoadingScreen />
    }

    // otherwise, we're ready to render the app

    // wire stores defined in root-store.ts file
    const { navigationStore, ...otherStores } = rootStore

    return (
      <ActionSheetProvider>
        <Provider rootStore={rootStore} navigationStore={navigationStore} {...otherStores}>
          <ApplicationProvider mapping={mapping} theme={lightTheme}>
            <IconRegistry icons={EvaIconsPack}/>
            <BackButtonHandler canExit={this.canExit}>
              <StatefulNavigator />
            </BackButtonHandler>
          </ApplicationProvider>
        </Provider>
      </ActionSheetProvider>
    )
  }
}

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */
const APP_NAME = "LikeCoinApp"

// Should we show storybook instead of our app?
//
// ⚠️ Leave this as `false` when checking into git.
const SHOW_STORYBOOK = false

const RootComponent = SHOW_STORYBOOK && __DEV__ ? StorybookUIRoot : App
AppRegistry.registerComponent(APP_NAME, () => RootComponent)
