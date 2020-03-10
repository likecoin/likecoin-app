import * as React from "react"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { AmountInputView } from "../../components/amount-input-view"
import { LoadingScreen } from "../../components/loading-screen"

import { ChainStore } from "../../models/chain-store"
import { RootStore } from "../../models/root-store"
import { TransferStore } from "../../models/transfer-store"

import { TransferNavigatorParams } from "../../navigation/transfer-navigator"

import { logAnalyticsEvent } from "../../utils/analytics"

import TransferGraph from "../../assets/graph/transfer.svg"

export interface TransferAmountInputScreenProps extends NavigationScreenProps<TransferNavigatorParams> {
  txStore: TransferStore,
  chain: ChainStore,
}

@inject((rootStore: RootStore) => ({
  txStore: rootStore.transferStore,
  chain: rootStore.chainStore,
}))
@observer
export class TransferAmountInputScreen extends React.Component<TransferAmountInputScreenProps, {}> {
  componentDidMount() {
    this._mapParamsToProps()
  }

  componentDidUpdate(prepProps: TransferAmountInputScreenProps) {
    this._mapParamsToProps(prepProps)
  }

  _mapParamsToProps = (prepProps?: TransferAmountInputScreenProps) => {
    const skipToConfirm = this.props.navigation.getParam("skipToConfirm")
    const prevAmount = prepProps && prepProps.navigation.getParam("amount")
    const amount = this.props.navigation.getParam("amount")
    if (!prevAmount && amount) this.props.txStore.setAmount(amount, true)
    if (!prevAmount && amount && skipToConfirm) {
      this.createTransactionForSigning().then(() => {
        this.props.navigation.replace("TransferSigning", { skipToConfirm })
      })
    }
  }

  /**
   * Validate the amount and create transaction for signing
   *
   * @return `true` if the success; otherwise, `false`
   */
  private createTransactionForSigning = async () => {
    const { address, availableBalance } = this.props.chain.wallet
    try {
      await this.props.txStore.createTransferTx(address)
      const { totalAmount } = this.props.txStore
      if (totalAmount.isGreaterThan(availableBalance)) {
        throw new Error("TRANSFER_AMOUNT_EXCEED_MAX")
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
    this.props.navigation.goBack()
  }

  private onPressNextButton = async () => {
    logAnalyticsEvent('TransferConfirmAmount')
    if (await this.createTransactionForSigning()) {
      logAnalyticsEvent('TransferPrepareTx')
      this.props.navigation.navigate("TransferSigning")
    }
  }

  private onAmountExceedMax = () => {
    this.props.txStore.setError(new Error("TRANSFER_AMOUNT_EXCEED_MAX"))
  }

  private onAmountLessThanZero = () => {
    this.props.txStore.setError(new Error("TRANSFER_AMOUNT_LESS_THAN_ZERO"))
  }

  render () {
    const {
      inputAmount,
      amount,
      errorMessage,
      isCreatingTx,
    } = this.props.txStore

    const skipToConfirm = this.props.navigation.getParam("skipToConfirm")
    if (skipToConfirm) {
      return <LoadingScreen />
    }

    return (
      <AmountInputView
        value={inputAmount}
        amount={amount}
        maxAmount={this.props.chain.wallet.availableBalance}
        error={errorMessage}
        availableLabelTx="transferAmountInputScreen.available"
        confirmButtonTx="common.next"
        isConfirmButtonLoading={isCreatingTx}
        graph={<TransferGraph />}
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
