import * as React from "react"
import { SafeAreaView, StatusBar } from "react-native"
import { WebView as WebViewBase } from "react-native-webview"
import { inject } from "mobx-react"
import styled from "styled-components/native"

import { WalletConnectStore } from "../../models/wallet-connect-store"

import { COMMON_API_CONFIG } from "../../services/api/api-config"

interface NFTNotificationScreenProps {
  walletConnectStore: WalletConnectStore
}

const RootView = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.primary};
`

const HeaderView = styled.View`
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`

const WebView = styled(WebViewBase)`
  flex: 1;
`

@inject("walletConnectStore")
export class NFTNotificationScreen extends React.Component<NFTNotificationScreenProps, {}> {
  get webViewURL() {
    const baseURL = this.props.walletConnectStore.getConfig("LIKERLAND_URL")
    return `${baseURL}/notifications?in_app=1`
  }

  render() {
    return (
      <RootView>
        <HeaderView>
          <SafeAreaView>
            <StatusBar barStyle="light-content" />
          </SafeAreaView>
        </HeaderView>
        <WebView
          sharedCookiesEnabled={true}
          source={{ uri: this.webViewURL }}
          decelerationRate={0.998}
          // TODO: remove HACK after applicationNameForUserAgent type is fixed
          {...{ applicationNameForUserAgent: COMMON_API_CONFIG.userAgent }}
        />
      </RootView>
    )
  }
}
