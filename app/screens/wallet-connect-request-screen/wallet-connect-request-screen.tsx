import * as React from "react"
import { inject, observer } from "mobx-react"
import { NavigationStackScreenProps } from "react-navigation-stack"
import styled from "styled-components/native"

import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { WalletConnectSessionRequestView } from "../../components/wallet-connect-session-request-view"

import { ChainStore } from "../../models/chain-store"
import { UserStore } from "../../models/user-store";
import { WalletConnectStore } from "../../models/wallet-connect-store"

import { color } from "../../theme"

const RootView = styled(Screen)`
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`

const HeaderText = styled(Text)`
  color: ${({ theme }) => theme.color.text.feature.highlight.primary};
  font-size: ${({ theme }) => theme.text.size.lg};
  font-weight: 500;
  text-align: center;
`

export interface WalletConnectRequestScreenProps extends NavigationStackScreenProps<{
  peerId: string,
  peerMeta: any;
  payload: any;
}> {
  chainStore: ChainStore
  userStore: UserStore
  walletConnectStore: WalletConnectStore
}

const sessionMethods = [
  "session_request",
  "wc_sessionRequest",
  "session_update",
  "wc_sessionUpdate",
]

const chainId = 99999

@inject("chainStore")
@inject("userStore")
@inject("walletConnectStore")
@observer
export class WalletConnectRequestScreen extends React.Component<WalletConnectRequestScreenProps, {}> {
  private approveRequest = async () => {
    const payload = this.props.navigation.getParam("payload")

    const sessionRequest = sessionMethods.includes(payload.method)

    if (sessionRequest) {
      this.approveSessionRequest()
    } else {
      await this.handleCallRequest()
    }
  }

  private approveSessionRequest = async () => {
    const { wallet: { address } } = this.props.chainStore
    const peerId = this.props.navigation.getParam("peerId")

    const response = { accounts: [address], chainId }
    console.tron.log("handleSessionRequest", peerId, response)    

    this.props.walletConnectStore.approveSessionRequest(peerId, response)
    this.close()
  }

  private handleCallRequest = async () => {
    const payload = this.props.navigation.getParam("payload")

    let result = null;

    switch (payload.method) {
      case "keplr_enable_wallet_connect_v1":
        result = []
        break

      case "keplr_get_key_wallet_connect_v1":    
        result = [
          await this.props.chainStore.env.authCoreAPI.getWalletConnectGetKeyResponse(
            payload.params[0],
            { name: this.props.userStore.currentUser.likerID }
          ),
        ]
        break

      case "keplr_sign_amino_wallet_connect_v1":
        try {
          result = await this.props.chainStore.env.authCoreAPI.signAmino(
            payload.params[2],
            payload.params[1]
          )
          console.tron.log("keplr_sign_amino_wallet_connect_v1 signed", result)
        } catch (error) {
          console.tron.log("keplr_sign_amino_wallet_connect_v1 error", error.message)
        }
        break

      default:
        break
    }

    console.tron.log("handleCallRequest", payload, "result", result)    

    if (result) {
      await this.approveCallRequest(result)
    } else {
      await this.rejectRequest()
    }
  }

  private approveCallRequest = async (result: any) => {
    const peerId = this.props.navigation.getParam("peerId")
    const payload = this.props.navigation.getParam("payload")
    const response = {
      id: payload.id,
      result,
    }

    console.tron.log("approveCallRequest", payload, peerId, response)    

    await this.props.walletConnectStore.approveCallRequest(payload, peerId, response)

    console.tron.log("approveCallRequest done", payload)    

    this.close()
  }

  private rejectRequest = async () => {
    const peerId = this.props.navigation.getParam("peerId")
    const payload = this.props.navigation.getParam("payload")

    const sessionRequest = sessionMethods.includes(payload.method)

    if (sessionRequest) {
      console.tron.log("rejectSessionRequest", payload)    
      this.props.walletConnectStore.rejectSessionRequest(peerId)
    } else {
      console.tron.log("rejectCallRequest", payload)    
      await this.props.walletConnectStore.rejectCallRequest(peerId, {
        id: payload.id,
        error: { message: "User rejected call request" }
      })
    }

    this.close()
  }

  private close = () => {
    this.props.navigation.goBack()
  }

  private renderRequestView() {
    const { wallet: { address } } = this.props.chainStore
    const payload = this.props.navigation.getParam("payload")
    if (!payload) {
      return null
    }

    return (
      <WalletConnectSessionRequestView
        address={address}
        chainId={chainId}
        payload={payload}
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
        <HeaderText text="Wallet Connect" />
        {this.renderRequestView()}
      </RootView>
    )
  }
}
