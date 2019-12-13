import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { TransferStore } from "../../models/transfer-store"
import { WalletStore } from "../../models/wallet-store"

import { SigningView } from "../../components/signing-view"

import TransferGraph from "../../assets/graph/transfer.svg"

const GRAPH: ViewStyle = {
  marginRight: -18,
}

export interface TransferSigningScreenProps extends NavigationScreenProps<{}> {
  transferStore: TransferStore,
  walletStore: WalletStore,
}

@inject(
  "transferStore",
  "walletStore",
)
@observer
export class TransferSigningScreen extends React.Component<TransferSigningScreenProps> {
  private sendTransaction = async () => {
    await this.props.transferStore.signTx(this.props.walletStore.signer)
    if (this.props.transferStore.isSuccess) {
      this.props.walletStore.fetchBalance()
    }
  }

  private onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  private onPressConfirmButton = () => {
    if (this.props.transferStore.isSuccess) {
      this.props.navigation.dismiss()
    } else {
      this.sendTransaction()
    }
  }

  render () {
    const {
      amount,
      blockExplorerURL,
      errorMessage,
      fee,
      signingState: state,
      liker,
      receiverAddress,
      totalAmount,
    } = this.props.transferStore
    const { formatDenom } = this.props.walletStore

    const target = liker ? {
      avatar: liker.avatarURL,
      name: liker.displayName,
    } : receiverAddress

    return (
      <SigningView
        type="transfer"
        state={state}
        titleTx="transferSigningScreen.title"
        amount={formatDenom(amount)}
        txURL={blockExplorerURL}
        error={errorMessage}
        fee={formatDenom(fee)}
        target={target}
        totalAmount={formatDenom(totalAmount)}
        graph={<TransferGraph />}
        graphStyle={GRAPH}
        onClose={this.onPressCloseButton}
        onConfirm={this.onPressConfirmButton}
      />
    )
  }
}
