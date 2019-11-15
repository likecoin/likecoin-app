import React from 'react'
import { requireNativeComponent, NativeModules, Platform } from 'react-native'
import { WebView, WebViewProps } from 'react-native-webview'

const { LKCWebViewManager } = NativeModules
const LKCWebView = requireNativeComponent('LKCWebView')

export interface LikeCoinWebViewProps extends WebViewProps {}

export class LikeCoinWebView extends React.Component<LikeCoinWebViewProps, {}> {
  render() {
    return (
      <WebView
        {...this.props}
        nativeConfig={Platform.OS === "ios" && {
          component: LKCWebView,
          viewManager: LKCWebViewManager,
        }}
      />
    )
  }
}
