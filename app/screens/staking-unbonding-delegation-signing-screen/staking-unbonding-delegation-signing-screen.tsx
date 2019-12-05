import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { StakingUnbondingDelegationStore } from "../../models/staking-unbonding-delegation-store"
import { RootStore } from "../../models/root-store"
import { WalletStore } from "../../models/wallet-store"

import { SigningView } from "../../components/signing-view"

import Graph from "../../assets/graph/staking-unbonding-delegate.svg"

const GRAPH: ViewStyle = {
  marginRight: -20,
}

export interface StakingUnbondingDelegationSigningScreenProps extends NavigationScreenProps<{}> {
  txStore: StakingUnbondingDelegationStore,
  walletStore: WalletStore,
}

@inject((stores: RootStore) => ({
  txStore: stores.stakingUnbondingDelegationStore,
  walletStore: stores.walletStore,
}) as StakingUnbondingDelegationSigningScreenProps)
@observer
export class StakingUnbondingDelegationSigningScreen extends React.Component<StakingUnbondingDelegationSigningScreenProps, {}> {
  private sendTransaction = async () => {
    await this.props.txStore.signTx(this.props.walletStore.signer)
    if (this.props.txStore.isSuccess) {
      this.props.walletStore.fetchBalance()
      this.props.walletStore.fetchDelegations()
    }
  }

  private onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  private onPressConfirmButton = () => {
    if (this.props.txStore.isSuccess) {
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
      target,
      totalAmount,
    } = this.props.txStore
    const { formatDenom } = this.props.walletStore

    return (
      <SigningView
        type="unstake"
        state={state}
        titleTx="stakingUnbondingDelegationSigningScreen.title"
        amount={formatDenom(amount)}
        txURL={blockExplorerURL}
        error={errorMessage}
        fee={formatDenom(fee)}
        target={target}
        totalAmount={formatDenom(totalAmount)}
        graph={<Graph />}
        graphStyle={GRAPH}
        onClose={this.onPressCloseButton}
        onConfirm={this.onPressConfirmButton}
      />
    )
  }
}
