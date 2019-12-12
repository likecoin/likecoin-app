import * as React from "react"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { AmountInputView } from "../../components/amount-input-view"

import { ChainStore } from "../../models/chain-store"
import { RootStore } from "../../models/root-store"
import { StakingUnbondingDelegationStore } from "../../models/staking-unbonding-delegation-store"

import Graph from "../../assets/graph/staking-unbonding-delegate.svg"

export interface StakingUnbondingDelegationAmountInputScreenParams {
  target: string
}

export interface StakingUnbondingDelegationAmountInputScreenProps extends NavigationScreenProps<StakingUnbondingDelegationAmountInputScreenParams> {
  txStore: StakingUnbondingDelegationStore,
  chain: ChainStore,
}

@inject((rootStore: RootStore) => ({
  txStore: rootStore.stakingUnbondingDelegationStore,
  chain: rootStore.chainStore,
}))
@observer
export class StakingUnbondingDelegationAmountInputScreen extends React.Component<StakingUnbondingDelegationAmountInputScreenProps, {}> {
  constructor(props: StakingUnbondingDelegationAmountInputScreenProps) {
    super(props)
    const { fractionDenom, fractionDigits, gasPrice } = props.chain
    props.txStore.initialize(fractionDenom, fractionDigits, gasPrice)
    props.txStore.setTarget(props.navigation.getParam("target"))
  }

  getValidator = () => {
    return this.props.chain.validators.get(this.props.txStore.target)
  }

  /**
   * Validate the amount and create transaction for signing
   *
   * @return `true` if the success; otherwise, `false`
   */
  private createTransactionForSigning = async () => {
    try {
      const { address, availableBalance } = this.props.chain.wallet
      await this.props.txStore.createUnbondingDelegateTx(address)
      const { totalAmount } = this.props.txStore
      if (totalAmount.isGreaterThan(availableBalance)) {
        throw new Error("UNSTAKE_NOT_ENOUGH_FEE")
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
      this.props.navigation.navigate("StakingUnbondingDelegationSigning")
    }
  }

  private onAmountExceedMax = () => {
    this.props.txStore.setError(new Error("UNSTAKE_AMOUNT_EXCEED_MAX"))
  }

  private onAmountLessThanZero = () => {
    this.props.txStore.setError(new Error("UNSTAKE_AMOUNT_LESS_THAN_ZERO"))
  }

  render () {
    const {
      inputAmount,
      amount,
      errorMessage,
      isCreatingTx,
      target,
    } = this.props.txStore
    const delegation = this.props.chain.wallet.getDelegation(target)
    return (
      <AmountInputView
        value={inputAmount}
        amount={amount}
        maxAmount={delegation.shares}
        error={errorMessage}
        availableLabelTx="stakingUnbondingDelegationAmountInputScreen.available"
        confirmButtonTx="common.next"
        isConfirmButtonLoading={isCreatingTx}
        graph={<Graph />}
        formatAmount={this.props.chain.formatDenom}
        onChange={this.onAmountInputChange}
        onClose={this.onPressCloseButton}
        onConfirm={this.onPressNextButton}
        onErrorExceedMax={this.onAmountExceedMax}
        onErrorLessThanZero={this.onAmountLessThanZero}
      />
    )
  }
}
