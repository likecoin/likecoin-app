import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { TransferStore } from "../../models/transfer-store"
import { WalletStore } from "../../models/wallet-store"

import { SigningView, SigningViewStateType } from "../../components/signing-view"

import TransferGraph from "../../assets/graph/transfer.svg"

const GRAPH: ViewStyle = {
  marginRight: -18,
}

export interface TransferSigningScreenProps extends NavigationScreenProps<{}> {
  transferStore: TransferStore,
  walletStore: WalletStore,
}

export interface TransferSigningScreenState {
  state: SigningViewStateType
}

@inject(
  "transferStore",
  "walletStore",
)
@observer
export class TransferSigningScreen extends React.Component<TransferSigningScreenProps, TransferSigningScreenState> {
  state: TransferSigningScreenState = {
    state: "waiting"
  }

  _sendTransaction = async () => {
    this.setState({ state: "pending" })
    await this.props.transferStore.signTransaction(this.props.walletStore.signer)
    const state = this.props.transferStore.errorMessage ? "waiting" : "success"
    this.setState({ state })
    if (state === "success") {
      // Update balance
      this.props.walletStore.fetchBalance()
    }
  }

  private onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  private onPressConfirmButton = () => {
    if (this.state.state === "success") {
      this.props.navigation.dismiss()
    } else {
      this._sendTransaction()
    }
  }

  render () {
    const {
      amount,
      blockExplorerURL,
      errorMessage,
      fee,
      target,
      totalAmount,
    } = this.props.transferStore

    return (
      <SigningView
        type="transfer"
        state={this.state.state}
        titleTx="transferSigningScreen.title"
        amount={amount}
        txURL={blockExplorerURL}
        error={errorMessage}
        fee={fee}
        target={target}
        totalAmount={totalAmount}
        graph={<TransferGraph />}
        graphStyle={GRAPH}
        onClose={this.onPressCloseButton}
        onConfirm={this.onPressConfirmButton}
      />
    )
  }
}
