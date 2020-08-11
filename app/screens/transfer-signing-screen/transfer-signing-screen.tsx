import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { ChainStore } from "../../models/chain-store"
import { RootStore } from "../../models/root-store"
import { TransferStore } from "../../models/transfer-store"

import { SigningView } from "../../components/signing-view"

import { TransferNavigatorParams } from "../../navigation/transfer-navigator"
import { logAnalyticsEvent } from "../../utils/analytics"

import TransferGraph from "../../assets/graph/transfer.svg"

const GRAPH: ViewStyle = {
  marginRight: -18,
}

export interface TransferSigningScreenProps extends NavigationScreenProps<TransferNavigatorParams> {
  txStore: TransferStore,
  chain: ChainStore,
}

@inject((rootStore: RootStore) => ({
  txStore: rootStore.transferStore,
  chain: rootStore.chainStore,
}))
@observer
export class TransferSigningScreen extends React.Component<TransferSigningScreenProps> {
  private sendTransaction = async () => {
    await this.props.txStore.signTx(this.props.chain.wallet.signer)
    if (this.props.txStore.isSuccess) {
      logAnalyticsEvent('TransferSuccess')
      this.props.chain.fetchBalance()
    }
  }

  private onPressCloseButton = () => {
    const skipToConfirm = this.props.navigation.getParam("skipToConfirm")
    if (skipToConfirm) {
      this.props.navigation.dismiss()
    } else {
      this.props.navigation.goBack()
    }
  }

  private onPressConfirmButton = () => {
    if (this.props.txStore.isSuccess) {
      logAnalyticsEvent('TransferTxConfirmed')
      this.props.navigation.dismiss()
    } else {
      logAnalyticsEvent('TransferSign')
      this.sendTransaction()
    }
  }

  render () {
    const {
      amount,
      blockExplorerURL,
      errorMessage,
      fee,
      memo,
      signingState: state,
      liker,
      receiverAddress,
      totalAmount,
    } = this.props.txStore
    const { formatDenom } = this.props.chain

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
        memo={memo}
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
