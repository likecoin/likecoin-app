import * as React from "react"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { AmountInputView } from "../../components/amount-input-view"

import { StakingDelegationStore } from "../../models/staking-delegation-store"
import { RootStore } from "../../models/root-store"
import { WalletStore } from "../../models/wallet-store"

import Graph from "../../assets/graph/staking-delegate.svg"

export interface StakingDelegationAmountInputScreenParams {
  target: string
}

export interface StakingDelegationAmountInputScreenProps extends NavigationScreenProps<StakingDelegationAmountInputScreenParams> {
  txStore: StakingDelegationStore,
  walletStore: WalletStore,
}

@inject((stores: RootStore) => ({
  txStore: stores.stakingDelegationStore,
  walletStore: stores.walletStore,
}) as StakingDelegationAmountInputScreenProps)
@observer
export class StakingDelegationAmountInputScreen extends React.Component<StakingDelegationAmountInputScreenProps, {}> {
  constructor(props: StakingDelegationAmountInputScreenProps) {
    super(props)
    const { fractionDenom, fractionDigits, gasPrice } = props.walletStore
    props.txStore.initialize(fractionDenom, fractionDigits, gasPrice)
    props.txStore.setTarget(props.navigation.getParam("target"))
  }

  /**
   * Validate the amount and create transaction for signing
   *
   * @return `true` if the success; otherwise, `false`
   */
  private createTransactionForSigning = async () => {
    try {
      const { address, availableBalance } = this.props.walletStore
      await this.props.txStore.createDelegateTx(address)
      const { totalAmount } = this.props.txStore
      if (totalAmount.isGreaterThan(availableBalance)) {
        throw new Error("STAKE_AMOUNT_EXCEED_MAX")
      }
      return true
    } catch (error) {
      return this.props.txStore.setError(error)
    }
  }

  private onAmountInputChange = (amount: string) => {
    this.props.txStore.setAmount(amount)
  }

  private onPressCloseButton = () => {
    this.props.navigation.pop()
  }

  private onPressNextButton = async () => {
    if (await this.createTransactionForSigning()) {
      this.props.navigation.navigate("StakingDelegationSigning")
    }
  }

  private onAmountExceedMax = () => {
    this.props.txStore.setError(new Error("STAKE_AMOUNT_EXCEED_MAX"))
  }

  private onAmountLessThanZero = () => {
    this.props.txStore.setError(new Error("STAKE_AMOUNT_LESS_THAN_ZERO"))
  }

  render () {
    const {
      inputAmount,
      amount,
      errorMessage,
      isCreatingTx,
    } = this.props.txStore
    return (
      <AmountInputView
        value={inputAmount}
        amount={amount}
        maxAmount={this.props.walletStore.availableBalance}
        error={errorMessage}
        availableLabelTx="stakingDelegationAmountInputScreen.available"
        confirmButtonTx="common.next"
        isConfirmButtonLoading={isCreatingTx}
        graph={<Graph />}
        formatAmount={this.props.walletStore.formatDenom}
        onChange={this.onAmountInputChange}
        onClose={this.onPressCloseButton}
        onConfirm={this.onPressNextButton}
        onErrorExceedMax={this.onAmountExceedMax}
        onErrorLessThanZero={this.onAmountLessThanZero}
      />
    )
  }
}
