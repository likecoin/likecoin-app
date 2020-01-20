import * as React from "react"
import { inject, observer } from "mobx-react"

import {
  StakingRedelegationSigningScreenProps as Props,
  StakingRedelegationSigningScreenStyle as Style,
} from "."

import { RootStore } from "../../models/root-store"

import { Button } from "../../components/button"
import { SigningView } from "../../components/signing-view"

import { logAnalyticsEvent } from "../../utils/analytics"

import Graph from "../../assets/graph/staking-redelegate.svg"

@inject((rootStore: RootStore) => ({
  txStore: rootStore.stakingRedelegationStore,
  chain: rootStore.chainStore,
}))
@observer
export class StakingRedelegationSigningScreen extends React.Component<Props> {
  private sendTransaction = async () => {
    await this.props.txStore.signTx(this.props.chain.wallet.signer)
    const { from, isSuccess, target } = this.props.txStore
    if (isSuccess) {
      logAnalyticsEvent('StakeRedelegateSuccess')
      this.props.chain.fetchBalance()
      this.props.chain.fetchDelegation(from)
      this.props.chain.fetchDelegation(target)
      this.props.chain.fetchRewards()
    }
  }

  private onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  private onPressConfirmButton = () => {
    if (this.props.txStore.isSuccess) {
      logAnalyticsEvent('StakeRedelegateTxConfirmed')
      this.props.navigation.dismiss()
    } else {
      logAnalyticsEvent('StakeRedelegateSign')
      this.sendTransaction()
    }
  }

  render () {
    const {
      amount,
      blockExplorerURL,
      errorMessage,
      fee,
      from,
      signingState: state,
      target,
      totalAmount,
    } = this.props.txStore
    const { formatDenom } = this.props.chain
    const { avatar: fromAvatar, moniker: fromName } = this.props.chain.validators.get(from)
    const { avatar: targetAvatar, moniker: targetName } = this.props.chain.validators.get(target)

    return (
      <SigningView
        type="stake"
        state={state}
        titleTx="StakingRedelegationSigningScreen.title"
        amount={formatDenom(amount)}
        txURL={blockExplorerURL}
        error={errorMessage}
        fee={formatDenom(fee)}
        from={{ avatar: fromAvatar, name: fromName }}
        target={{ avatar: targetAvatar, name: targetName }}
        totalAmount={formatDenom(totalAmount)}
        graph={<Graph />}
        bottomNavigationAppendChildren={(
          <Button
            preset="link"
            tx="StakingRedelegationSigningScreen.aboutLinkText"
            link="http://bit.ly/34h2KhF"
            color="greyBlue"
            weight="400"
            style={Style.LearnMoreLink}
          />
        )}
        onClose={this.onPressCloseButton}
        onConfirm={this.onPressConfirmButton}
      />
    )
  }
}
