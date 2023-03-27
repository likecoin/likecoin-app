import * as React from "react"
import { SafeAreaView, StatusBar } from "react-native"
import { WebView as WebViewBase } from "react-native-webview"
import { inject } from "mobx-react"
import styled from "styled-components/native"

import { HeaderTabItem } from "../../components/header-tab"
import { HeaderTabContainerView } from "../../components/header-tab-container-view"
import { WalletConnectStore } from "../../models/wallet-connect-store"

import { COMMON_API_CONFIG } from "../../services/api/api-config"

interface NFTReaderScreenProps {
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
export class NFTReaderScreen extends React.Component<NFTReaderScreenProps, {}> {
  state = {
    tabValue: "listing",
  }

  get webViewURL() {
    const baseURL = this.props.walletConnectStore.getConfig("LIKERLAND_URL")
    switch (this.state.tabValue) {
      case "listing":
        return `${baseURL}/writing-nft`
      
      case "dashboard":
        return `${baseURL}/dashboard`

      default:
        return baseURL;
    }
  }

  private onTabChange = (value: string) => {
    this.setState({ tabValue: value })
  }

  render() {
    const { tabValue } = this.state

    return (
      <RootView>
        <HeaderView>
          <SafeAreaView>
            <StatusBar barStyle="light-content" />
          </SafeAreaView>
        </HeaderView>
        <HeaderTabContainerView
          value={tabValue}
          items={[
            <HeaderTabItem
              key="listing"
              value="listing"
              icon="nft-stack"
              subtitleTx="nft_reader_screen_tab_listing"
            />,
            <HeaderTabItem
              key="dashboard"
              value="dashboard"
              icon="person"
              subtitleTx="nft_reader_screen_tab_dashboard"
            />,
          ]}
          onChange={this.onTabChange}
        >
          {({ tabValue, ...props }) => {
            return (
              <WebView
                key={tabValue}
                contentInset={props.contentInset}
                containerStyle={props.contentContainerStyle}
                sharedCookiesEnabled={true}
                source={{ uri: `${this.webViewURL}?in_app=1` }}
                decelerationRate={0.998}
                // TODO: remove HACK after applicationNameForUserAgent type is fixed
                {...{ applicationNameForUserAgent: COMMON_API_CONFIG.userAgent }}
              />
            )
          }}
        </HeaderTabContainerView>
      </RootView>
    )
  }
}
