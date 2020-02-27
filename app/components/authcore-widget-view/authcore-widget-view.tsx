import * as React from "react"
import { WebView } from "react-native-webview"
import AuthcoreClient from "react-native-authcore/src/networking"

import {
  AuthcoreWidgetViewProps as Props,
} from "./authcore-widget-view.props"
import {
  AuthcoreWidgetViewStyle as Style,
} from "./authcore-widget-view.style"

import { Screen } from "../screen"

import { color } from "../../theme"

export class AuthcoreWidgetView extends React.Component<Props> {
  client: AuthcoreClient

  widgetPath: string

  constructor (props: Props) {
    super(props)
    const {
      baseURL: baseUrl,
      accessToken,
      company = undefined,
      logo = undefined,
      internal = false,
      page = "settings",
    } = this.props

    if (accessToken === undefined) {
      throw new Error("accessToken is undefined, please provide access token for normal access.")
    }
    this.client = new AuthcoreClient({
      baseUrl,
    })

    const containerId = Math.random().toString(36).substring(2)
    if (typeof internal !== 'boolean') {
      throw new Error("internal param must be boolean")
    }

    this.widgetPath = this.client.url(`widgets/${page}`, {
      cid: containerId,
      company: company,
      logo: logo,
      primaryColour: color.primary,
      successColour: color.palette.lightCyan,
      dangerColour: color.palette.angry,
      internal: internal
    })
  }

  onMessage = (payload: any) => {
    console.tron.log(payload)
  }

  render () {
    const { accessToken, style } = this.props
    const accessTokenPayload = {
      type: "AuthCore_accessToken",
      data: accessToken,
    }
    const injectAccessToken = `
      window.ReactNativeWebView.postMessage('${JSON.stringify(accessTokenPayload)}')
    `
    return (
      <Screen
        preset="fixed"
        backgroundColor={color.primary}
        style={Style.Root}
      >
        <WebView
          source={{ uri: this.widgetPath }}
          injectedJavaScript={accessToken !== undefined && injectAccessToken}
          onMessage={this.onMessage} // NOTE: For ReactNativeWebView injection
          style={style}
        />
      </Screen>
    )
  }
}
