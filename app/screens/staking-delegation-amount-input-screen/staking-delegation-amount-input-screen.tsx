import * as React from "react"
import { NavigationStackScreenProps } from "react-navigation-stack"
import { inject, observer } from "mobx-react"
import BigNumber from "bignumber.js"

import { AmountInputView } from "../../components/amount-input-view"

import { StakingDelegationStore } from "../../models/staking-delegation-store"
import { ChainStore } from "../../models/chain-store"
import { RootStore } from "../../models/root-store"

import { logAnalyticsEvent } from "../../utils/analytics"

import Graph from "../../assets/graph/staking-delegate.svg"

export interface StakingDelegationAmountInputScreenParams {
  target: string
  suggestedAmount?: BigNumber
}

export interface StakingDelegationAmountInputScreenProps extends NavigationStackScreenProps<StakingDelegationAmountInputScreenParams> {
  txStore: StakingDelegationStore
  chain: ChainStore
}

@inject((rootStore: RootStore) => ({
  txStore: rootStore.stakingDelegationStore,
  chain: rootStore.chainStore,
}))
@observer
export class StakingDelegationAmountInputScreen extends React.Component<StakingDelegationAmountInputScreenProps, {}> {
  constructor(props: StakingDelegationAmountInputScreenProps) {
    super(props)
    const { fractionDenom, fractionDigits } = props.chain
    props.txStore.initialize(fractionDenom, fractionDigits)
    props.txStore.setTarget(props.navigation.getParam("target"))
  }

  get suggestedAmount() {
    return this.props.navigation.getParam("suggestedAmount")
  }

  /**
   * Validate the amount and create transaction for signing
   *
   * @return `true` if the success; otherwise, `false`
   */
  private createTransactionForSigning = async () => {
    try {
      const { address, availableBalance } = this.props.chain.wallet
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

  private onPressCloseButton = () => {
    this.props.navigation.pop()
  }

  private onPressNextButton = async () => {
    logAnalyticsEvent('StakeDelegateConfirmAmount')
    if (await this.createTransactionForSigning()) {
      logAnalyticsEvent('StakeDelegatePrepareTx')
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
    const address = this.props.navigation.getParam("target")
    const validator = this.props.chain.validators.get(address)
    return (
      <AmountInputView
        value={inputAmount}
        amount={amount}
        civicLikerStakingPreset={validator.isCivicLiker ? "mini" : ""}
        maxAmount={this.props.chain.wallet.availableBalance}
        suggestedAmount={this.suggestedAmount}
        isShowSuggestionButton={!!this.suggestedAmount}
        suggestionButtonTitle={this.suggestedAmount
          ? `${this.props.chain.toDenom(this.suggestedAmount).toFixed()} ${this.props.chain.denom}`
          : undefined
        }
        error={errorMessage}
        availableLabelTx="stakingDelegationAmountInputScreen.available"
        confirmButtonTx="common.next"
        isConfirmButtonLoading={isCreatingTx}
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
