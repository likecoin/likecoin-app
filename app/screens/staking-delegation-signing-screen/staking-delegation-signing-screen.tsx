import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { StakingDelegationStore } from "../../models/staking-delegation-store"
import { RootStore } from "../../models/root-store"
import { Validator } from "../../models/validator"
import { WalletStore } from "../../models/wallet-store"

import { Button } from "../../components/button"
import { SigningView } from "../../components/signing-view"

import { spacing } from "../../theme"

import Graph from "../../assets/graph/staking-delegate.svg"

const GRAPH: ViewStyle = {
  marginRight: 20,
}
const ABOUT_LINK_BUTTON: ViewStyle = {
  marginTop: spacing[3],
}

export interface StakingDelegationSigningScreenProps extends NavigationScreenProps<{}> {
  txStore: StakingDelegationStore,
  walletStore: WalletStore,
}

@inject((stores: RootStore) => ({
  txStore: stores.stakingDelegationStore,
  walletStore: stores.walletStore,
}) as StakingDelegationSigningScreenProps)
@observer
export class StakingDelegationSigningScreen extends React.Component<StakingDelegationSigningScreenProps, {}> {
  private sendTransaction = async () => {
    await this.props.txStore.signTx(this.props.walletStore.signer)
    if (this.props.txStore.isSuccess) {
      this.props.walletStore.fetchBalance()
      this.props.walletStore.fetchValidators()
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
        type="stake"
        state={state}
        titleTx="stakingDelegationSigningScreen.title"
        amount={formatDenom(amount)}
        txURL={blockExplorerURL}
        error={errorMessage}
        fee={formatDenom(fee)}
        target={{ avatar, name }}
        totalAmount={formatDenom(totalAmount)}
        graph={<Graph />}
        graphStyle={GRAPH}
        children
        bottomNavigationAppendChildren={(
          <Button
            preset="link"
            tx="stakingDelegationSigningScreen.aboutLinkText"
            link="http://bit.ly/34h2KhF"
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
