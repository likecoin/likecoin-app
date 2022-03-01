import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationStackScreenProps } from "react-navigation-stack"
import { inject, observer } from "mobx-react"

import { ChainStore } from "../../models/chain-store"
import { RootStore } from "../../models/root-store"
import { StakingUnbondingDelegationStore } from "../../models/staking-unbonding-delegation-store"

import { Button } from "../../components/button"
import { SigningView } from "../../components/signing-view"
import { Validator } from "../../models/validator"

import { spacing } from "../../theme"

import { logAnalyticsEvent } from "../../utils/analytics"

import Graph from "../../assets/graph/staking-unbonding-delegate.svg"

const GRAPH: ViewStyle = {
  marginRight: -20,
}
const ABOUT_LINK_BUTTON: ViewStyle = {
  marginTop: spacing[3],
}

export interface StakingUnbondingDelegationSigningScreenProps extends NavigationStackScreenProps<{}> {
  txStore: StakingUnbondingDelegationStore
  chain: ChainStore
}

@inject((rootStore: RootStore) => ({
  txStore: rootStore.stakingUnbondingDelegationStore,
  chain: rootStore.chainStore,
}))
@observer
export class StakingUnbondingDelegationSigningScreen extends React.Component<StakingUnbondingDelegationSigningScreenProps, {}> {
  private sendTransaction = async () => {
    await this.props.txStore.signTx(this.props.chain.wallet.signer)
    const { target, isSuccess } = this.props.txStore
    if (isSuccess) {
      logAnalyticsEvent('StakeUndelegateSuccess')
      this.props.chain.fetchBalance()
      this.props.chain.fetchDelegation(target)
      this.props.chain.fetchRewards()
      this.props.chain.validators.get(target).fetchInfo()
    }
  }

  private onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  private onPressConfirmButton = () => {
    if (this.props.txStore.isSuccess) {
      logAnalyticsEvent('StakeUndelegateConfirmAmount')
      this.props.navigation.dismiss()
    } else {
      logAnalyticsEvent('StakeUndelegatePrepareTx')
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
    } = this.props.txStore
    const { formatDenom } = this.props.chain
    const { avatar, moniker: name }: Validator = this.props.chain.validators.get(target)

    return (
      <SigningView
        type="unstake"
        state={state}
        titleTx="stakingUnbondingDelegationSigningScreen.title"
        amount={formatDenom(amount)}
        txURL={blockExplorerURL}
        error={errorMessage}
        fee={formatDenom(fee)}
        from={{ avatar, name }}
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
