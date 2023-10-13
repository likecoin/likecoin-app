import * as React from "react"
import { Alert } from "react-native"
import { inject, observer } from "mobx-react"
import { NavigationStackScreenProps } from "react-navigation-stack"
import styled from "styled-components/native"

import { WalletConnectStore } from "../../models/wallet-connect-store"

import { color } from "../../theme"
import { translate } from "../../i18n"
import { checkIsInAppBrowser } from "../../utils/wallet-connect"

import { Button } from "../../components/button"
import { LoadingLikeCoin } from "../../components/loading-likecoin"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"
import { WalletConnectSessionRequestView } from "../../components/wallet-connect-session-request-view"

const RootView = styled(Screen)`
  flex-grow: 1;
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`

const LoadingView = styled.View`
  flex-grow: 1;
  align-items: stretch;
  padding: ${({ theme }) => theme.spacing.lg};
`

const LoadingLikeCoinWrapper = styled.View`
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`

const HeaderText = styled(Text)`
  color: ${({ theme }) => theme.color.text.feature.highlight.primary};
  font-size: ${({ theme }) => theme.text.size.lg};
  font-weight: 500;
  text-align: center;
`

const LoadingHintText = styled(Text)`
  margin-top: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.color.palette.offWhite};
  text-align: center;
`

export interface WalletConnectRequestScreenProps extends NavigationStackScreenProps<{
  peerId: string,
  peerMeta: any;
  payload: any;
}> {
  walletConnectStore: WalletConnectStore
}

@inject("walletConnectStore")
@observer
export class WalletConnectRequestScreen extends React.Component<WalletConnectRequestScreenProps, {}> {

  patientTimer?: number

  state = {
    shouldShowLoadingHint: false,
  }

  componentDidMount() {
    this.patientTimer = setTimeout(() => {
      this.setState({ shouldShowLoadingHint: true })
    }, 5000)
  }

  componentWillUnmount() {
    clearTimeout(this.patientTimer)
  }

  get payload() {
    return this.props.navigation.getParam("payload")
  }

  get peerMeta() {
    return this.props.navigation.getParam("peerMeta")
  }

  get peerId() {
    return this.props.navigation.getParam("peerId")
  }

  get requestor() {
    return this.props.walletConnectStore.getClient(this.peerId)
  }

  private approveRequest = async () => {
    this.close()
    await this.requestor.approveRequest(this.payload, this.peerId)

    switch (this.requestor.version) {
      case 1:
        if (this.requestor.isInAppBrowser) return;
        break;
    
      case 2:
        if (checkIsInAppBrowser(this.payload)) return;
        break;

      default:
        break;
    }

    // Show return to browser hint
    let hintMessageKey: string
    if (
      this.payload.method === 'likerId_login'
      || (
        this.payload.method === 'cosmos_signAmino'
        && this.payload.params[2]?.memo.includes('Login - Reinventing the Like')
      )
    ) {
      hintMessageKey = "walletConnectRequestView_label_description_login_back"
    } else {
      hintMessageKey = "walletConnectRequestView_label_description_back"
    }
    Alert.alert(
      translate("walletConnectRequestScreen_title"),
      translate(hintMessageKey),
      [
        { text: translate("common.confirm") },
      ]
    )
  }

  private rejectRequest = async () => {
    this.close()
    this.requestor.rejectRequest(this.payload, this.peerId)
  }

  private close = () => {
    this.props.navigation.goBack()
  }

  private renderRequestView() {
    if (!this.payload) {
      return (
        <LoadingView>
          <LoadingLikeCoinWrapper>
            <LoadingLikeCoin />
            {this.state.shouldShowLoadingHint && (
              <LoadingHintText tx="walletConnectRequestView_loading_hint" />
            )}
          </LoadingLikeCoinWrapper>
          <Button
            preset="outlined"
            tx="walletConnectRequestView_button_reject"
            onPress={this.close}
          />
        </LoadingView>
      )
    }

    return (
      <WalletConnectSessionRequestView
        payload={this.payload}
        peerMeta={this.peerMeta}
        onApprove={this.approveRequest}
        onReject={this.rejectRequest}
      />
    )
  }

  render () {
    return (
      <RootView
        backgroundColor={color.palette.likeGreen}
        preset="scroll"
      >
        <HeaderText tx="walletConnectRequestScreen_title" />
        {this.renderRequestView()}
      </RootView>
    )
  }
}
