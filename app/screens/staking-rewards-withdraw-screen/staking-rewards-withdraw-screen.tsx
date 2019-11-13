import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { StakingRewardsWithdrawStore } from "../../models/staking-rewards-withdraw-store"
import { RootStore } from "../../models/root-store"
import { WalletStore } from "../../models/wallet-store"

import { SigningView, SigningViewStateType } from "../../components/signing-view"

import Graph from "../../assets/graph/staking-rewards-withdraw.svg"

import { formatNumber } from "../../utils/number"

const GRAPH: ViewStyle = {
  marginRight: -20,
}

export interface StakingRewardsWithdrawScreenProps extends NavigationScreenProps<{}> {
  txStore: StakingRewardsWithdrawStore
  walletStore: WalletStore
}

export interface StakingRewardsWithdrawScreenState {
  state: SigningViewStateType
}

@inject((stores: RootStore) => ({
  txStore: stores.stakingRewardsWithdrawStore,
  walletStore: stores.walletStore,
}) as StakingRewardsWithdrawScreenProps)
@observer
export class StakingRewardsWithdrawScreen extends React.Component<
  StakingRewardsWithdrawScreenProps,
  StakingRewardsWithdrawScreenState
> {
  state: StakingRewardsWithdrawScreenState = {
    state: "waiting",
  }

  constructor(props: StakingRewardsWithdrawScreenProps) {
    super(props)
    props.txStore.createTransaction(
      props.walletStore.address,
      props.walletStore.validatorListWithRewards,
    )
  }

  private sendTransaction = async () => {
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
    this.props.navigation.pop()
  }

  private onPressConfirmButton = () => {
    if (this.state.state === "success") {
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
    } = this.props.txStore
    return (
      <SigningView
        type="reward"
        state={this.state.state}
        titleTx="stakingRewardsWithdrawScreen.title"
        amount={formatNumber(this.props.walletStore.rewardsBalance)}
        txURL={blockExplorerURL}
        error={errorMessage}
        fee={fee}
        graph={<Graph />}
        graphStyle={GRAPH}
        onClose={this.onPressCloseButton}
        onConfirm={this.onPressConfirmButton}
      />
    )
  }
}
