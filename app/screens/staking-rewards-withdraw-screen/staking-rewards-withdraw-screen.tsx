import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { StakingRewardsWithdrawStore } from "../../models/staking-rewards-withdraw-store"
import { RootStore } from "../../models/root-store"
import { WalletStore } from "../../models/wallet-store"

import { SigningView } from "../../components/signing-view"

import Graph from "../../assets/graph/staking-rewards-withdraw.svg"

const GRAPH: ViewStyle = {
  marginRight: -20,
}

export interface StakingRewardsWithdrawScreenProps extends NavigationScreenProps<{}> {
  txStore: StakingRewardsWithdrawStore
  walletStore: WalletStore
}

@inject((stores: RootStore) => ({
  txStore: stores.stakingRewardsWithdrawStore,
  walletStore: stores.walletStore,
}) as StakingRewardsWithdrawScreenProps)
@observer
export class StakingRewardsWithdrawScreen extends React.Component<StakingRewardsWithdrawScreenProps, {}> {
  constructor(props: StakingRewardsWithdrawScreenProps) {
    super(props)
    const { fractionDenom, fractionDigits, gasPrice } = props.walletStore
    props.txStore.initialize(fractionDenom, fractionDigits, gasPrice)
    props.txStore.createRewardsWithdrawTx(
      props.walletStore.address,
      props.walletStore.validatorListWithRewards,
    )
  }

  private sendTransaction = async () => {
    await this.props.txStore.signTx(this.props.walletStore.signer)
    if (this.props.txStore.isSuccess) {
      this.props.walletStore.fetchBalance()
      this.props.walletStore.fetchDelegations()
      this.props.walletStore.fetchRewards()
    }
  }

  private onPressCloseButton = () => {
    this.props.navigation.pop()
  }

  private onPressConfirmButton = () => {
    if (this.props.txStore.isSuccess) {
      this.props.navigation.pop()
    } else {
      this.sendTransaction()
    }
  }

  render () {
    const {
      blockExplorerURL,
      errorMessage,
      fee,
      signingState: state,
    } = this.props.txStore
    const {
      formatDenom,
      rewardsBalance,
    } = this.props.walletStore
    return (
      <SigningView
        type="reward"
        state={state}
        titleTx="stakingRewardsWithdrawScreen.title"
        amount={formatDenom(rewardsBalance)}
        txURL={blockExplorerURL}
        error={errorMessage}
        fee={formatDenom(fee)}
        graph={<Graph />}
        graphStyle={GRAPH}
        onClose={this.onPressCloseButton}
        onConfirm={this.onPressConfirmButton}
      />
    )
  }
}
