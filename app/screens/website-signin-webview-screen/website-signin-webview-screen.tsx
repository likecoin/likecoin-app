import * as React from "react"
import { WebView } from "react-native-webview"

import {
  WebsiteSignInWebviewScreenProps as Props,
} from "./website-signin-webview-screen.props"
import {
  WebsiteSignInWebviewScreenStyle as Style,
} from "./website-signin-webview-screen.style"

import { Header } from "../../components/header"
import { Screen } from "../../components/screen"

import { COMMON_API_CONFIG } from "../../services/api/api-config"

export class WebsiteSignInWebviewScreen extends React.Component<Props> {
  private onPressHeaderLeftButton = () => {
    this.props.navigation.goBack()
  }

  private onPressHeaderRightButton = () => {
    this.props.navigation.popToTop()
  }

  render() {
    const { url } = this.props.navigation.state.params
    return (
      <Screen
        preset="fixed"
        style={Style.Root}
      >
        <Header
          headerText={url}
          leftIcon="back"
          rightIcon="close"
          onLeftPress={this.onPressHeaderLeftButton}
          onRightPress={this.onPressHeaderRightButton}
        />
        <WebView
          sharedCookiesEnabled={true}
          source={{ uri: url }}
          decelerationRate={0.998}
          // TODO: remove HACK after applicationNameForUserAgent type is fixed
          {...{ applicationNameForUserAgent: COMMON_API_CONFIG.userAgent }}
          style={Style.Webview}
        />
      </Screen>
    )
  }
}
