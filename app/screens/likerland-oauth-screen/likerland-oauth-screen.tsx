import * as React from "react"
import {
  Alert,
  View,
} from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { WebViewNavigation } from 'react-native-webview'
import {
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
} from "react-native-webview/lib/WebViewTypes"
import { inject } from "mobx-react"

import { Style } from "./likerland-oauth-screen.style"

import { LikeCoinWebView } from "../../components/likecoin-webview"
import { LoadingLikeCoin } from "../../components/loading-likecoin"
import { Screen } from "../../components/screen"

import { color } from "../../theme"

import { RootStore } from "../../models/root-store"

import { translate } from "../../i18n"
import { COMMON_API_CONFIG } from "../../services/api/api-config"
import { logError } from "../../utils/error"

export interface LikerLandOAuthScreenProps extends NavigationScreenProps<{}> {
  rootStore: RootStore,
}

@inject("rootStore")
export class LikerLandOAuthScreen extends React.Component<LikerLandOAuthScreenProps> {
  redirectTimer?: NodeJS.Timeout

  state = {
    hasHandledRedirect: false,
  }

  private handleError = async () => {
    await this.props.rootStore.userStore.logout()
    this.props.rootStore.userStore.setIsSigningIn(false)
    this.props.navigation.goBack()
  }

  private handlePostSignIn = async () => {
    if (this.state.hasHandledRedirect) return
    this.setState({ hasHandledRedirect: true })
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer)
      this.redirectTimer = undefined
    }
    await Promise.all([
      this.props.rootStore.userStore.fetchUserInfo(),
      this.props.rootStore.userStore.fetchLikerLandUserInfo(),
    ])
    this.props.navigation.navigate("App")

    // Try to open the deferred deep link URL after sign in
    this.props.rootStore.openDeepLink()
  }

  private handleURLChange = (url: string) => {
    if (url.includes("/following")) {
      this.handlePostSignIn()
    } else if (url.includes("/oauth/redirect")) {
      // Fallback to use timer if the above case not working
      this.redirectTimer = setTimeout(this.handlePostSignIn, 2000)
    } else if (url.includes("/in/register")) {
      this.handleError()
      logError("Error when signing in to liker.land, like.co shows register page")
    }
  }

  private onNavigationStateChange = ({ url }: WebViewNavigation) => {
    this.handleURLChange(url)
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

  private onError = (event: WebViewErrorEvent) => {
    this.onWebviewError()
    const { code, description, url } = event.nativeEvent
    logError(`Error occurs inside webview when signing in to liker.land ${JSON.stringify({ code, description, url })}`)
  }

  private onHttpError = (event: WebViewHttpErrorEvent) => {
    this.onWebviewError()
    const { description, statusCode, url } = event.nativeEvent
    logError(`HTTP error occurs inside webview when signing in to liker.land ${JSON.stringify({ description, statusCode, url })}`)
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
            onError={this.onError}
            onHttpError={this.onHttpError}
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
