import * as React from "react"
import { SafeAreaView, StatusBar } from "react-native"
import { inject } from "mobx-react"
import styled from "styled-components/native"

import { NFTWebView as NFTWebViewBase } from "../../components/nft-web-view"

import { WalletConnectStore } from "../../models/wallet-connect-store"

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

const NFTWebView = styled(NFTWebViewBase)`
  flex: 1;
`

@inject("walletConnectStore")
export class NFTNotificationScreen extends React.Component<NFTNotificationScreenProps, {}> {
  get webViewURL() {
    const baseURL = this.props.walletConnectStore.localizedLikerLandBaseURL
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
        <NFTWebView
          key={this.webViewURL}
          source={{ uri: this.webViewURL }}
        />
      </RootView>
    )
  }
}
