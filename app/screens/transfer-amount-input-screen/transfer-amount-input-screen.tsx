import * as React from "react"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { AmountInputView } from "../../components/amount-input-view"

import { TransferStore } from "../../models/transfer-store"
import { WalletStore } from "../../models/wallet-store"

import TransferGraph from "../../assets/graph/transfer.svg"

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
  /**
   * Validate the amount and create transaction for signing
   *
   * @return `true` if the success; otherwise, `false`
   */
  private createTransactionForSigning = async () => {
    const { address, availableBalance } = this.props.walletStore
    try {
      await this.props.transferStore.createTransferTx(address)
      const { totalAmount } = this.props.transferStore
      if (totalAmount.isGreaterThan(availableBalance)) {
        throw new Error("TRANSFER_AMOUNT_EXCEED_MAX")
      }
      return true
    } catch (error) {
      return this.props.transferStore.setError(error)
    }
  }

  private onAmountInputChange = (amount: string) => {
    this.props.transferStore.setAmount(amount)
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
    this.props.transferStore.setError(new Error("TRANSFER_AMOUNT_EXCEED_MAX"))
  }

  private onAmountLessThanZero = () => {
    this.props.transferStore.setError(new Error("TRANSFER_AMOUNT_LESS_THAN_ZERO"))
  }

  render () {
    const {
      inputAmount,
      amount,
      errorMessage,
      isCreatingTx,
    } = this.props.transferStore
    return (
      <AmountInputView
        value={inputAmount}
        amount={amount}
        maxAmount={this.props.walletStore.availableBalance}
        error={errorMessage}
        availableLabelTx="transferAmountInputScreen.available"
        confirmButtonTx="common.next"
        isConfirmButtonLoading={isCreatingTx}
        graph={<TransferGraph />}
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
