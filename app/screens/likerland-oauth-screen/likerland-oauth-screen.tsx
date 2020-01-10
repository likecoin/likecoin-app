import * as React from "react"
import {
  NativeSyntheticEvent,
  View,
} from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { WebViewNavigation } from 'react-native-webview'
import { inject } from "mobx-react"

import { Style } from "./likerland-oauth-screen.style"

import { LikeCoinWebView } from "../../components/likecoin-webview"
import { Screen } from "../../components/screen"

import { color } from "../../theme"

import { RootStore } from "../../models/root-store"
import { LoadingLikeCoin } from "../../components/loading-likecoin"

import { COMMON_API_CONFIG } from "../../services/api/api-config"

export interface LikerLandOAuthScreenProps extends NavigationScreenProps<{}> {
  rootStore: RootStore,
}

@inject("rootStore")
export class LikerLandOAuthScreen extends React.Component<LikerLandOAuthScreenProps, {}> {
  _onLoadEnd = async (syntheticEvent: NativeSyntheticEvent<WebViewNavigation>) => {
    const { url } = syntheticEvent.nativeEvent
    const { rootStore } = this.props
    if (url.includes("/oauth/redirect")) {
      // TODO: Should listen to window.postMessage from liker.land
      setTimeout(() => {
        this.props.navigation.navigate("App")
      }, 2000)

      // Try to open the deferred deep link URL after sign in
      rootStore.openDeepLink()
    } else if (url.includes("/in/register")) {
      await rootStore.userStore.logout()
      rootStore.userStore.setIsSigningIn(false)
      this.props.navigation.goBack()
    }
  }

  render () {
    const {
      signInURL,
    } = this.props.rootStore.userStore
    return (
      <Screen
        preset="fixed"
        backgroundColor={color.primary}
        style={Style.Screen}
      >
        <View style={Style.Overlay}>
          <LikeCoinWebView
            style={Style.Webview}
            sharedCookiesEnabled={true}
            source={{ uri: signInURL }}
            onLoadEnd={this._onLoadEnd}
            userAgent={ COMMON_API_CONFIG.userAgent }
          />
          <View style={Style.LoadingWrapper}>
            <LoadingLikeCoin />
          </View>
        </View>
      </Screen>
    )
  }
}
