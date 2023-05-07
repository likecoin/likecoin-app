import * as React from "react"
import { WebView, WebViewNavigation, WebViewProps } from "react-native-webview"

import { COMMON_API_CONFIG } from "../../services/api/api-config"
import { Linking } from "react-native"
import { OnShouldStartLoadWithRequest } from "react-native-webview/lib/WebViewTypes"

export function NFTWebView(props: WebViewProps) {

  const handleShouldStartLoadWithRequest: OnShouldStartLoadWithRequest = ({ url }: WebViewNavigation) => {
    if (/\.(pdf|epub)/i.test(url)) {
      Linking.openURL(url)
      return false
    }
    return true
  }

  return (
    <WebView
      {...props}
      sharedCookiesEnabled={true}
      decelerationRate={0.998}
      // TODO: remove HACK after applicationNameForUserAgent type is fixed
      {...{ applicationNameForUserAgent: COMMON_API_CONFIG.userAgent }}
      onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
    />
  )
}
