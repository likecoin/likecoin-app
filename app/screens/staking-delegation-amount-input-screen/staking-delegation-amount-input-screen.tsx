import * as React from "react"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"
import BigNumber from "bignumber.js"

import { AmountInputView } from "../../components/amount-input-view"

import { StakingDelegationStore } from "../../models/staking-delegation-store"
import { RootStore } from "../../models/root-store"
import { WalletStore } from "../../models/wallet-store"

import Graph from "../../assets/graph/staking-delegate.svg"

import { translate } from "../../i18n"

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
  state = {
    /**
     * The code of the error description which is looked up via i18n.
     */
    error: "",

    /**
     * True when creating transaction
     */
    isCreatingTransaction: false,
  }

  componentDidMount() {
    this.props.txStore.resetInput()
    this.props.txStore.setTarget(this.props.navigation.getParam("target"))
  }

  private setError = (
    error: string,
    shouldTranslate: boolean = true,
  ) => {
    this.setState({
      error: shouldTranslate ? translate(`error.${error}`) : error,
      isCreatingTransaction: false
    })
    return false
  }

  /**
   * Validate the amount and create transaction for signing
   *
   * @return `true` if the success; otherwise, `false`
   */
  private createTransactionForSigning = async () => {
    this.setState({ isCreatingTransaction: true })
    try {
      await this.props.txStore.createTransaction(this.props.walletStore.address)
      const amountWithFee = new BigNumber(this.props.txStore.totalAmount)
      const maxAmount = new BigNumber(this.props.walletStore.availableBalanceInLIKE)
      if (amountWithFee.isGreaterThan(maxAmount)) {
        return this.setError("STAKE_AMOUNT_EXCEED_MAX")
      }
      return true
    } catch (error) {
      __DEV__ && console.tron.error(error.mssage, null)
      return this.setError(error.message, false)
    } finally {
      this.setState({ isCreatingTransaction: false })
    }
  }

  private onAmountInputChange = (amount: string) => {
    this.props.txStore.setAmount(amount)
    if (this.state.error) {
      this.setState({ error: "" })
    }
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
    this.setError("STAKE_AMOUNT_EXCEED_MAX")
  }

  private onAmountLessThanZero = () => {
    this.setError("STAKE_AMOUNT_LESS_THAN_ZERO")
  }

  render () {
    return (
      <AmountInputView
        amount={this.props.txStore.amount}
        maxAmount={this.props.walletStore.availableBalanceInLIKE}
        error={this.state.error}
        availableLabelTx="stakingDelegationAmountInputScreen.available"
        confirmButtonTx="common.next"
        isConfirmButtonLoading={this.state.isCreatingTransaction}
        graph={<Graph />}
        onChange={this.onAmountInputChange}
        onClose={this.onPressCloseButton}
        onConfirm={this.onPressNextButton}
        onErrorExceedMax={this.onAmountExceedMax}
        onErrorLessThanZero={this.onAmountLessThanZero}
      />
    )
  }
}
