import React from 'react';
import { requireNativeComponent, NativeModules} from 'react-native'
import { WebView, WebViewProps } from 'react-native-webview'

const { LKCWebViewManager } = NativeModules
const LKCWebView = requireNativeComponent('LKCWebView')

export interface LikeCoinWebViewProps extends WebViewProps {}

export class LikeCoinWebView extends React.Component<LikeCoinWebViewProps, {}> {  
  render() {
    return (
      <WebView
        {...this.props}
        nativeConfig={{
          component: LKCWebView,
          viewManager: LKCWebViewManager,
        }}
      />
    )
  }
}
