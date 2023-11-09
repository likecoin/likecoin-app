import * as React from "react"
import { Linking, SafeAreaView, StatusBar } from "react-native"
import { inject } from "mobx-react"
import styled from "styled-components/native"

import { NFTWebView as NFTWebViewBase } from "../../components/nft-web-view"

import { WalletConnectStore } from "../../models/wallet-connect-store"
import { UserStore } from "../../models/user-store"
import { WebViewNavigation } from "react-native-webview"

interface NFTNotificationScreenProps {
  userStore: UserStore
  walletConnectStore: WalletConnectStore
}

const RootView = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.primary};
`

const HeaderView = styled.View`
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`

const NFTWebView = styled(NFTWebViewBase)`
  flex: 1;
`

@inject("userStore", "walletConnectStore")
export class NFTNotificationScreen extends React.Component<NFTNotificationScreenProps, {}> {
  componentDidMount(): void {
    this.props.userStore.clearUnseenEventCount()
  }

  get webViewURL() {
    const baseURL = this.props.walletConnectStore.localizedLikerLandBaseURL
    return `${baseURL}/notifications?in_app=1`
  }

  handlePressRefresh() {
    this.props.userStore.loadUnseenEventCount()
  }

  handleShouldStartLoadWithRequest({ url }: WebViewNavigation) {
    if (url.startsWith("intent://") && url.includes('package=com.oice')) {
      Linking.openURL(
        url.replace("intent://", "com.oice://")
          .replace('#Intent;package=com.oice;scheme=com.oice;end;', '')
      ).catch(err => { console.error(err) });
      return false
    }

    return true
  }

  render() {
    return (
      <RootView>
        <HeaderView>
          <SafeAreaView>
            <StatusBar barStyle="light-content" />
          </SafeAreaView>
        </HeaderView>
        <NFTWebView
          key={this.webViewURL}
          source={{ uri: this.webViewURL }}
          onPressRefresh={this.handlePressRefresh}
          originWhitelist={['https://*', 'http://*', 'intent://*']}
          onShouldStartLoadWithRequest={this.handleShouldStartLoadWithRequest}
        />
      </RootView>
    )
  }
}
