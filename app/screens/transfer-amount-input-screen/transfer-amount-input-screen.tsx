import * as React from "react"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"
import BigNumber from "bignumber.js"

import { AmountInputView } from "../../components/amount-input-view"

import { TransferStore } from "../../models/transfer-store"
import { WalletStore } from "../../models/wallet-store"

import TransferGraph from "../../assets/graph/transfer.svg"

import { translate } from "../../i18n"

export interface TransferAmountInputScreenProps extends NavigationScreenProps<{}> {
  transferStore: TransferStore,
  walletStore: WalletStore,
}

@inject(
  "transferStore",
  "walletStore",
)
@observer
export class TransferAmountInputScreen extends React.Component<TransferAmountInputScreenProps, {}> {
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
      await this.props.transferStore.createTransaction(this.props.walletStore.address)
      const amountWithFee = new BigNumber(this.props.transferStore.totalAmount)
      const maxAmount = new BigNumber(this.props.walletStore.availableBalanceInLIKE)
      if (amountWithFee.isGreaterThan(maxAmount)) {
        return this.setError("TRANSFER_AMOUNT_EXCEED_MAX")
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
    this.props.transferStore.setAmount(amount)
    if (this.state.error) {
      this.setState({ error: "" })
    }
  }

  private onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  private onPressNextButton = async () => {
    if (await this.createTransactionForSigning()) {
      this.props.navigation.navigate("TransferSigning")
    }
  }

  private onAmountExceedMax = () => {
    this.setError("TRANSFER_AMOUNT_EXCEED_MAX")
  }

  private onAmountLessThanZero = () => {
    this.setError("TRANSFER_AMOUNT_LESS_THAN_ZERO")
  }

  render () {
    return (
      <AmountInputView
        amount={this.props.transferStore.amount}
        maxAmount={this.props.walletStore.availableBalanceInLIKE}
        error={this.state.error}
        availableLabelTx="transferAmountInputScreen.available"
        confirmButtonTx="common.next"
        isConfirmButtonLoading={this.state.isCreatingTransaction}
        graph={<TransferGraph />}
        onChange={this.onAmountInputChange}
        onClose={this.onPressCloseButton}
        onConfirm={this.onPressNextButton}
        onErrorExceedMax={this.onAmountExceedMax}
        onErrorLessThanZero={this.onAmountLessThanZero}
      />
    )
  }
}
