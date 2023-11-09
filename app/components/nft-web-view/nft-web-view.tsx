import * as React from "react"
import { BackHandler, Linking, View } from "react-native"
import { WebView as WebViewBase, WebViewNavigation, WebViewProps } from "react-native-webview"
import { OnShouldStartLoadWithRequest } from "react-native-webview/lib/WebViewTypes"
import styled from "styled-components/native"

import { COMMON_API_CONFIG } from "../../services/api/api-config"

import { Button } from "../button"

const WebView = styled(WebViewBase)`
  flex: 1;
`

const ControlBar = styled.View`
  flex-direction: row;
  justify-content: space-around;

  padding: ${({ theme }) => theme.spacing.sm};

  border-top-width: 1px;
  border-color: ${({ theme }) => theme.color.separator};
`

export interface NFTWebViewProps extends WebViewProps {
  onPressRefresh?: () => void
}

export function NFTWebView({ style, onPressRefresh, ...props }: NFTWebViewProps) {
  const webViewRef = React.useRef<WebViewBase>(null)

  const [webViewKey, setWebViewKey] = React.useState(0);

  const handleShouldStartLoadWithRequest: OnShouldStartLoadWithRequest = ({ url }: WebViewNavigation) => {
    if (/\.(pdf|epub)/i.test(url)) {
      Linking.openURL(url)
      return false
    }
    if (url.startsWith("intent://") && url.includes('package=com.oice')) {
      Linking.openURL(
        url.replace("intent://", "com.oice://")
          .replace('#Intent;package=com.oice;scheme=com.oice;end;', '')
      ).catch(err => { console.error(err) });
      return false
    }
    return true
  }

  const handleBackButtonPress = () => {
    webViewRef.current?.goBack()
  }

  const handleHomeButtonPress = () => {
    // HACK: Switching key to force go to the initial page
    setWebViewKey((webViewKey + 1) % 2)
  }

  const handleRefreshButtonPress = () => {
    webViewRef.current?.reload()
    onPressRefresh?.()
  }

  const handleHardwareBackButtonPress = () => {
    handleBackButtonPress()
    return true
  }

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleHardwareBackButtonPress)
    return () => backHandler.remove()
  }, [])

  return (
    <View style={style}>
      <WebView
        key={`${webViewKey}}`}
        ref={webViewRef}
        {...props}
        sharedCookiesEnabled={true}
        decelerationRate={0.998}
        originWhitelist={['https://*', 'http://*', 'intent://*']}
        // TODO: remove HACK after applicationNameForUserAgent type is fixed
        {...{ applicationNameForUserAgent: COMMON_API_CONFIG.userAgent }}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
      />
      <ControlBar>
        <Button icon="back" size="tiny" preset="plain" onPress={handleBackButtonPress} />
        <Button icon="home" size="tiny" preset="plain" onPress={handleHomeButtonPress} />
        <Button icon="undo" size="tiny" preset="plain" onPress={handleRefreshButtonPress} />
      </ControlBar>
    </View>
  )
}
