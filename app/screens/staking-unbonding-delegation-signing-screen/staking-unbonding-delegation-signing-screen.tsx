import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { StakingUnbondingDelegationStore } from "../../models/staking-unbonding-delegation-store"
import { RootStore } from "../../models/root-store"
import { WalletStore } from "../../models/wallet-store"

import { Button } from "../../components/button"
import { SigningView } from "../../components/signing-view"
import { Validator } from "../../models/validator"

import { spacing } from "../../theme"

import Graph from "../../assets/graph/staking-unbonding-delegate.svg"

const GRAPH: ViewStyle = {
  marginRight: -20,
}
const ABOUT_LINK_BUTTON: ViewStyle = {
  marginTop: spacing[3],
}

export interface StakingUnbondingDelegationSigningScreenProps extends NavigationScreenProps<{}> {
  txStore: StakingUnbondingDelegationStore,
  walletStore: WalletStore,
}

@inject((stores: RootStore) => ({
  txStore: stores.stakingUnbondingDelegationStore,
  walletStore: stores.walletStore,
}) as StakingUnbondingDelegationSigningScreenProps)
@observer
export class StakingUnbondingDelegationSigningScreen extends React.Component<StakingUnbondingDelegationSigningScreenProps, {}> {
  private sendTransaction = async () => {
    await this.props.txStore.signTx(this.props.walletStore.signer)
    if (this.props.txStore.isSuccess) {
      this.props.walletStore.fetchBalance()
      this.props.walletStore.fetchDelegations()
    }
  }

  private onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  private onPressConfirmButton = () => {
    if (this.props.txStore.isSuccess) {
      this.props.navigation.dismiss()
    } else {
      this.sendTransaction()
    }
  }

  render () {
    const {
      amount,
      blockExplorerURL,
      errorMessage,
      fee,
      signingState: state,
      target,
      totalAmount,
    } = this.props.txStore
    const { formatDenom } = this.props.walletStore
    const { avatar, moniker: name }: Validator = this.props.walletStore.validators.get(target)

    return (
      <SigningView
        type="unstake"
        state={state}
        titleTx="stakingUnbondingDelegationSigningScreen.title"
        amount={formatDenom(amount)}
        txURL={blockExplorerURL}
        error={errorMessage}
        fee={formatDenom(fee)}
        target={{ avatar, name }}
        totalAmount={formatDenom(totalAmount)}
        graph={<Graph />}
        graphStyle={GRAPH}
        bottomNavigationAppendChildren={(
          <Button
            preset="link"
            tx="stakingUnbondingDelegationSigningScreen.aboutLinkText"
            link="http://bit.ly/2LMwXyE"
            color="greyBlue"
            weight="400"
            style={ABOUT_LINK_BUTTON}
          />
        )}
        onClose={this.onPressCloseButton}
        onConfirm={this.onPressConfirmButton}
      />
    )
  }
}
