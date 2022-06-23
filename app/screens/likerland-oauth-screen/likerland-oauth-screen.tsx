import * as React from "react"
import { Alert, View } from "react-native"
import { NavigationStackScreenProps } from "react-navigation-stack"
import { WebViewNavigation } from "react-native-webview"
import {
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
} from "react-native-webview/lib/WebViewTypes"
import { inject } from "mobx-react"

import { Style } from "./likerland-oauth-screen.style"

import { LikeCoinWebView } from "../../components/likecoin-webview"
import { LoadingScreen } from "../../components/loading-screen"

import { UserStore } from "../../models/user-store"
import { DeepLinkHandleStore } from "../../models/deep-link-handle-store"

import { translate } from "../../i18n"
import { COMMON_API_CONFIG } from "../../services/api/api-config"
import { logError } from "../../utils/error"

export interface LikerLandOAuthScreenProps extends NavigationStackScreenProps<{}> {
  userStore: UserStore
  deepLinkHandleStore: DeepLinkHandleStore
}

@inject("deepLinkHandleStore", "userStore")
export class LikerLandOAuthScreen extends React.Component<
  LikerLandOAuthScreenProps
> {
  redirectTimer?: number

  patientTimer?: number

  verifySignInRetryCount = 0

  isVerifyingSignIn = false

  hasHandledRedirect = false

  hasShownErrorAlert = false

  state = {
    loadingScreenText: "",
  }

  componentDidMount() {
    this.patientTimer = setTimeout(() => {
      this.setState({
        loadingScreenText: translate("signInScreen.LoadingTakesLonger"),
      })
    }, 5000)
  }

  componentWillUnmount() {
    clearTimeout(this.patientTimer)
    if (this.redirectTimer) clearTimeout(this.redirectTimer)
  }

  get maxVerifySignInRetryCount() {
    return this.props.userStore.getNumericConfig(
      "LIKERLAND_SIGNIN_RETRY_COUNT",
      5,
    )
  }

  private handleError = async () => {
    this.props.navigation.popToTop()
    this.props.userStore.logout()
  }

  private handlePostSignIn = async () => {
    if (this.hasHandledRedirect) return
    this.hasHandledRedirect = true
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer)
      this.redirectTimer = undefined
    }
    await Promise.all([
      this.props.userStore.fetchUserInfo(),
      this.props.userStore.appMeta.fetch(),
    ])
    await this.props.userStore.postResume()
    this.props.navigation.navigate("App")

    // Try to open the deferred deep link URL after sign in
    await this.props.deepLinkHandleStore.openBranchDeepLink()
    this.props.deepLinkHandleStore.openDeepLink()
  }

  private handleURLChange = (url: string) => {
    if (this.hasHandledRedirect) return
    if (url.includes("/following")) {
      this.handlePostSignIn()
    } else if (url.includes("/oauth/redirect")) {
      // Verify sign in with retry
      this.verifySignIn()
    } else if (url.includes("/in/register")) {
      this.showErrorAlert(translate("signInScreen.errorLikeCo"))
      logError(
        "Error when signing in to liker.land, like.co shows register page",
      )
    }
  }

  private verifySignIn = async () => {
    if (this.hasHandledRedirect || this.isVerifyingSignIn) return
    this.isVerifyingSignIn = true
    const response = await this.props.userStore.env.likerLandAPI.fetchCurrentUserInfo(
      { isSlient: true },
    )
    this.isVerifyingSignIn = false
    if (this.hasHandledRedirect) return
    if (response.kind === "ok") {
      this.handlePostSignIn()
    } else if (this.verifySignInRetryCount < this.maxVerifySignInRetryCount) {
      this.verifySignInRetryCount += 1
      this.redirectTimer = setTimeout(this.verifySignIn, 1000)
    } else {
      this.showErrorAlert(translate("signInScreen.errorLikerLandTimeout"))
      logError(
        "Error when signing in to liker.land, verification retry timeout",
      )
    }
  }

  private onNavigationStateChange = ({ url }: WebViewNavigation) => {
    this.handleURLChange(url)
  }

  private showErrorAlert = (message?: string) => {
    if (this.hasShownErrorAlert) return
    this.hasShownErrorAlert = true
    Alert.alert(
      translate("signInScreen.error"),
      message || translate("signInScreen.errorLikerLand"),
      [
        {
          text: translate("common.back"),
          onPress: () => {
            this.hasShownErrorAlert = false
            this.handleError()
          },
        },
      ],
    )
  }

  private onError = (event: WebViewErrorEvent) => {
    const { code, description, url } = event.nativeEvent
    this.showErrorAlert(translate("signInScreen.errorLikerLandHTTP", {
      code,
      description,
    }))
    logError(
      `Error occurs inside webview when signing in to liker.land ${JSON.stringify(
        { code, description, url },
      )}`,
    )
  }

  private onHttpError = (event: WebViewHttpErrorEvent) => {
    const { description, statusCode, url } = event.nativeEvent
    this.showErrorAlert(translate("signInScreen.errorLikerLandWebview", {
      code: statusCode,
      description,
    }))
    logError(
      `HTTP error occurs inside webview when signing in to liker.land ${JSON.stringify(
        { description, statusCode, url },
      )}`,
    )
  }

  render() {
    const { signInURL } = this.props.userStore
    return (
      <React.Fragment>
        <View style={Style.WebViewWrapper}>
          <LikeCoinWebView
            sharedCookiesEnabled={true}
            source={{ uri: signInURL }}
            // TODO: remove HACK after applicationNameForUserAgent type is fixed
            {...{ applicationNameForUserAgent: COMMON_API_CONFIG.userAgent }}
            onNavigationStateChange={this.onNavigationStateChange}
            onError={this.onError}
            onHttpError={this.onHttpError}
          />
        </View>
        <LoadingScreen
          text={this.state.loadingScreenText}
          style={Style.LoadingScreen}
        />
      </React.Fragment>
    )
  }
}
