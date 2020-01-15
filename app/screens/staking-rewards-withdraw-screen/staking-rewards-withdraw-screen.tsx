import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { ChainStore } from "../../models/chain-store"
import { RootStore } from "../../models/root-store"
import { StakingRewardsWithdrawStore } from "../../models/staking-rewards-withdraw-store"

import { SigningView } from "../../components/signing-view"

import { logAnalyticsEvent } from "../../utils/analytics"

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
    const {
      fractionDenom,
      fractionDigits,
      gasPrice,
      wallet: {
        address,
        rewardsBalance,
        validatorAddressListWithRewards: validatorAddresses,
      },
    } = props.chain
    props.txStore.initialize(fractionDenom, fractionDigits, gasPrice)
    props.txStore.createRewardsWithdrawTx(address, validatorAddresses, rewardsBalance)
  }

  private sendTransaction = async () => {
    await this.props.txStore.signTx(this.props.chain.wallet.signer)
    if (this.props.txStore.isSuccess) {
      logAnalyticsEvent('StakeWithdrawRwdSuccess')
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
      logAnalyticsEvent('StakeWithdrawRwdTxConfirmed')
      this.props.navigation.pop()
    } else {
      logAnalyticsEvent('StakeWithdrawRwdSign')
      this.sendTransaction()
    }
  }

  render () {
    const {
      blockExplorerURL,
      canWithdraw,
      errorMessage,
      fee,
      rewardsBalance,
      signingState: state,
    } = this.props.txStore
    const {
      formatDenom,
      formatBalance,
    } = this.props.chain
    return (
      <SigningView
        type="reward"
        state={state}
        titleTx="stakingRewardsWithdrawScreen.title"
        amount={formatBalance(rewardsBalance)}
        txURL={blockExplorerURL}
        error={errorMessage}
        fee={formatDenom(fee)}
        graph={<Graph />}
        graphStyle={GRAPH}
        isConfirmButtonDisabled={!canWithdraw}
        onClose={this.onPressCloseButton}
        onConfirm={this.onPressConfirmButton}
      />
    )
  }
}
