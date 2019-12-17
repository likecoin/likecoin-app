import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { ChainStore } from "../../models/chain-store"
import { RootStore } from "../../models/root-store"
import { StakingRewardsWithdrawStore } from "../../models/staking-rewards-withdraw-store"

import { SigningView } from "../../components/signing-view"

import Graph from "../../assets/graph/staking-rewards-withdraw.svg"

const GRAPH: ViewStyle = {
  marginRight: -20,
}

export interface StakingRewardsWithdrawScreenProps extends NavigationScreenProps<{}> {
  chain: ChainStore
  txStore: StakingRewardsWithdrawStore
}

@inject((stores: RootStore) => ({
  txStore: stores.stakingRewardsWithdrawStore,
  chain: stores.chainStore,
}) as StakingRewardsWithdrawScreenProps)
@observer
export class StakingRewardsWithdrawScreen extends React.Component<StakingRewardsWithdrawScreenProps, {}> {
  constructor(props: StakingRewardsWithdrawScreenProps) {
    super(props)
    const { fractionDenom, fractionDigits, gasPrice } = props.chain
    props.txStore.initialize(fractionDenom, fractionDigits, gasPrice)
    props.txStore.createRewardsWithdrawTx(
      props.chain.wallet.address,
      props.chain.wallet.validatorAddressListWithRewards,
    )
  }

  private sendTransaction = async () => {
    await this.props.txStore.signTx(this.props.chain.wallet.signer)
    if (this.props.txStore.isSuccess) {
      this.props.chain.fetchBalance()
      this.props.chain.fetchDelegations()
      this.props.chain.fetchRewards()
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
      formattedRewardsBalance,
    } = this.props.chain
    return (
      <SigningView
        type="reward"
        state={state}
        titleTx="stakingRewardsWithdrawScreen.title"
        amount={formattedRewardsBalance}
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
