import * as React from "react"
import {
  Alert,
  View,
} from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { WebViewNavigation } from 'react-native-webview'
import { inject } from "mobx-react"

import { Style } from "./likerland-oauth-screen.style"

import { LikeCoinWebView } from "../../components/likecoin-webview"
import { LoadingLikeCoin } from "../../components/loading-likecoin"
import { Screen } from "../../components/screen"

import { color } from "../../theme"

import { RootStore } from "../../models/root-store"

import { translate } from "../../i18n"
import { COMMON_API_CONFIG } from "../../services/api/api-config"

export interface LikerLandOAuthScreenProps extends NavigationScreenProps<{}> {
  rootStore: RootStore,
}

@inject("rootStore")
export class LikerLandOAuthScreen extends React.Component<LikerLandOAuthScreenProps, {}> {
  private onNavigationStateChange = async (navState: WebViewNavigation) => {
    const { url } = navState
    const { rootStore } = this.props
    if (url.includes("/following")) {
      await Promise.all([
        this.props.rootStore.userStore.fetchUserInfo(),
        this.props.rootStore.userStore.fetchLikerLandUserInfo(),
      ])
      this.props.navigation.navigate("App")

      // Try to open the deferred deep link URL after sign in
      rootStore.openDeepLink()
    } else if (url.includes("/in/register")) {
      this.handleError()
    }
  }

  private handleError = async () => {
    await this.props.rootStore.userStore.logout()
    this.props.rootStore.userStore.setIsSigningIn(false)
    this.props.navigation.goBack()
  }

  private onWebviewError = () => {
    Alert.alert(
      translate("signInScreen.error"),
      translate("signInScreen.errorLikerLand"),
      [
        {
          text: translate("common.back"),
          onPress: this.handleError,
        },
      ]
    )
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
            // TODO: remove HACK after applicationNameForUserAgent type is fixed
            {...{ applicationNameForUserAgent: COMMON_API_CONFIG.userAgent }}
            renderError={this.renderLoadingOverlay}
            onNavigationStateChange={this.onNavigationStateChange}
            onError={this.onWebviewError}
            onHttpError={this.onWebviewError}
          />
          {this.renderLoadingOverlay()}
        </View>
      </Screen>
    )
  }

  private renderLoadingOverlay = () => {
    return (
      <View style={Style.LoadingWrapper}>
        <LoadingLikeCoin />
      </View>
    )
  }
}
