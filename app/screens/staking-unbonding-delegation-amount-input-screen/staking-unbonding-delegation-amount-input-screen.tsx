import * as React from "react"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"
import BigNumber from "bignumber.js"

import { AmountInputView } from "../../components/amount-input-view"

import { StakingUnbondingDelegationStore } from "../../models/staking-unbonding-delegation-store"
import { RootStore } from "../../models/root-store"
import { WalletStore } from "../../models/wallet-store"

import Graph from "../../assets/graph/staking-unbonding-delegate.svg"

import { translate } from "../../i18n"
import { convertNanolikeToLIKE } from "../../services/cosmos/cosmos.utils"

export interface StakingUnbondingDelegationAmountInputScreenParams {
  target: string
}

export interface StakingUnbondingDelegationAmountInputScreenProps extends NavigationScreenProps<StakingUnbondingDelegationAmountInputScreenParams> {
  txStore: StakingUnbondingDelegationStore,
  walletStore: WalletStore,
}

@inject((stores: RootStore) => ({
  txStore: stores.stakingUnbondingDelegationStore,
  walletStore: stores.walletStore,
}) as StakingUnbondingDelegationAmountInputScreenProps)
@observer
export class StakingUnbondingDelegationAmountInputScreen extends React.Component<StakingUnbondingDelegationAmountInputScreenProps, {}> {
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

  constructor(props: StakingUnbondingDelegationAmountInputScreenProps) {
    super(props)
    props.txStore.resetInput()
    props.txStore.setTarget(props.navigation.getParam("target"))
  }

  getValidator = () => {
    return this.props.walletStore.validators.get(this.props.txStore.target)
  }
  
  getMaxAmount = () => {
    return convertNanolikeToLIKE(this.getValidator().delegationShare)
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
      const amount = new BigNumber(this.props.txStore.amount)
      const fee = new BigNumber(this.props.txStore.fee)
      if (fee.isGreaterThan(amount)) {
        return this.setError("UNSTAKE_NOT_ENOUGH_FEE")
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
      this.props.navigation.navigate("StakingUnbondingDelegationSigning")
    }
  }

  private onAmountExceedMax = () => {
    this.setError("UNSTAKE_AMOUNT_EXCEED_MAX")
  }

  private onAmountLessThanZero = () => {
    this.setError("UNSTAKE_AMOUNT_LESS_THAN_ZERO")
  }

  render () {
    return (
      <AmountInputView
        amount={this.props.txStore.amount}
        maxAmount={this.getMaxAmount()}
        error={this.state.error}
        availableLabelTx="stakingUnbondingDelegationAmountInputScreen.available"
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
