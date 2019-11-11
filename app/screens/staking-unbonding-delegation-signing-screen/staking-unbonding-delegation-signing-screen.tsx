import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { StakingUnbondingDelegationStore } from "../../models/staking-unbonding-delegation-store"
import { RootStore } from "../../models/root-store"
import { WalletStore } from "../../models/wallet-store"

import { SigningView, SigningViewStateType } from "../../components/signing-view"

import Graph from "../../assets/graph/staking-unbonding-delegate.svg"

const GRAPH: ViewStyle = {
  marginRight: -20,
}

export interface StakingUnbondingDelegationSigningScreenProps extends NavigationScreenProps<{}> {
  txStore: StakingUnbondingDelegationStore,
  walletStore: WalletStore,
}

export interface StakingUnbondingDelegationSigningScreenState {
  state: SigningViewStateType
}

@inject((stores: RootStore) => ({
  txStore: stores.stakingUnbondingDelegationStore,
  walletStore: stores.walletStore,
}) as StakingUnbondingDelegationSigningScreenProps)
@observer
export class StakingUnbondingDelegationSigningScreen extends React.Component<StakingUnbondingDelegationSigningScreenProps, StakingUnbondingDelegationSigningScreenState> {
  state: StakingUnbondingDelegationSigningScreenState = {
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
      this.props.walletStore.fetchDelegations()
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
        titleTx="stakingUnbondingDelegationSigningScreen.title"
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
