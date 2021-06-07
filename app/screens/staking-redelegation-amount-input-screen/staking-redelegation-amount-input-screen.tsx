import * as React from "react"
import { inject, observer } from "mobx-react"

import { StakingRedelegationAmountInputScreenProps as Props } from "./"

import { AmountInputView } from "../../components/amount-input-view"

import { RootStore } from "../../models/root-store"

import { logAnalyticsEvent } from "../../utils/analytics"

import Graph from "../../assets/graph/staking-redelegate.svg"

@inject((rootStore: RootStore) => ({
  txStore: rootStore.stakingRedelegationStore,
  chain: rootStore.chainStore,
}))
@observer
export class StakingRedelegationAmountInputScreen extends React.Component<Props> {
  /**
   * Validate the amount and create transaction for signing
   *
   * @return `true` if the success; otherwise, `false`
   */
  private createTransactionForSigning = async () => {
    try {
      const { address, availableBalance } = this.props.chain.wallet
      await this.props.txStore.createRedelegateTx(address)
      const { fee } = this.props.txStore
      if (fee.isGreaterThan(availableBalance)) {
        throw new Error("REDELEGATE_NOT_ENOUGH_FEE")
      }
      return true
    } catch (error) {
      return this.props.txStore.setError(error)
    }
  }

  private onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  private onPressNextButton = async () => {
    logAnalyticsEvent('StakeRedelegateConfirmAmount')
    if (await this.createTransactionForSigning()) {
      logAnalyticsEvent('StakeRedelegatePrepareTx')
      this.props.navigation.navigate("StakingRedelegationSigning")
    }
  }

  private onAmountExceedMax = () => {
    this.props.txStore.setError(new Error("REDELEGATE_AMOUNT_EXCEED_MAX"))
  }

  private onAmountLessThanZero = () => {
    this.props.txStore.setError(new Error("REDELEGATE_AMOUNT_LESS_THAN_ZERO"))
  }

  render () {
    const {
      inputAmount,
      amount,
      errorMessage,
      from,
      isCreatingTx,
    } = this.props.txStore
    const delegatedAmount = this.props.chain.wallet.getDelegation(from).balance
    return (
      <AmountInputView
        value={inputAmount}
        amount={amount}
        maxAmount={delegatedAmount}
        error={errorMessage}
        availableLabelTx="StakingRedelegationAmountInputScreen.availableLabelText"
        confirmButtonTx="common.next"
        isConfirmButtonLoading={isCreatingTx}
        isShowMaxButton={true}
        graph={<Graph />}
        formatAmount={this.props.chain.formatDenom}
        onChange={this.props.txStore.setAmount}
        onClose={this.onPressCloseButton}
        onConfirm={this.onPressNextButton}
        onErrorExceedMax={this.onAmountExceedMax}
        onErrorLessThanZero={this.onAmountLessThanZero}
      />
    )
  }
}
