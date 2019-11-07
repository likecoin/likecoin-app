import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { StakingDelegationStore } from "../../models/staking-delegation-store"
import { RootStore } from "../../models/root-store"
import { WalletStore } from "../../models/wallet-store"

import { SigningView, SigningViewStateType } from "../../components/signing-view"

import Graph from "../../assets/graph/staking-delegate.svg"

const GRAPH: ViewStyle = {
  marginRight: 20,
}

export interface StakingDelegationSigningScreenProps extends NavigationScreenProps<{}> {
  txStore: StakingDelegationStore,
  walletStore: WalletStore,
}

export interface StakingDelegationSigningScreenState {
  state: SigningViewStateType
}

@inject((stores: RootStore) => ({
  txStore: stores.stakingDelegationStore,
  walletStore: stores.walletStore,
}) as StakingDelegationSigningScreenProps)
@observer
export class StakingDelegationSigningScreen extends React.Component<StakingDelegationSigningScreenProps, StakingDelegationSigningScreenState> {
  state: StakingDelegationSigningScreenState = {
    state: "waiting"
  }

  _sendTransaction = async () => {
    this.setState({ state: "pending" })
    await this.props.txStore.signTransaction(this.props.walletStore.signer)
    const state = this.props.txStore.errorMessage ? "waiting" : "success"
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
    } = this.props.txStore

    return (
      <SigningView
        state={this.state.state}
        titleTx="delegationStakeSigningScreen.title"
        amount={amount}
        txURL={blockExplorerURL}
        error={errorMessage}
        fee={fee}
        target={target}
        totalAmount={totalAmount}
        graph={<Graph />}
        graphStyle={GRAPH}
        onClose={this.onPressCloseButton}
        onConfirm={this.onPressConfirmButton}
      />
    )
  }
}
