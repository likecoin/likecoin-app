import * as React from "react"
import { inject, observer } from "mobx-react"
import styled from "styled-components/native"

import { logAnalyticsEvent } from "../../utils/analytics"

import { Validator } from "../../models/validator"
import { RootStore } from "../../models/root-store"

import { Header } from "../../components/header"
import { Screen as ScreenBase } from "../../components/screen"
import { ValidatorList as ValidatorListBase } from "../../components/validator-list"

import { StakingRedelegationValidatorInputScreenProps as Props } from "./"

const Screen = styled(ScreenBase)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`

const ValidatorList = styled(ValidatorListBase)`
  background-color: ${({ theme }) => theme.color.background.secondary};
  padding: 0 ${({ theme }) => theme.spacing.xs};
`

@inject((rootStore: RootStore) => ({
  txStore: rootStore.stakingRedelegationStore,
  chain: rootStore.chainStore,
}))
@observer
export class StakingRedelegationValidatorInputScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    const { fractionDenom, fractionDigits } = props.chain
    props.txStore.initialize(fractionDenom, fractionDigits)
    props.txStore.setFrom(props.navigation.getParam("from"))
  }

  private onPressCloseButton = () => {
    this.props.navigation.pop()
  }

  private onPressValidator = (validator: Validator) => {
    this.props.txStore.setTarget(validator.operatorAddress)
    this.props.navigation.navigate("StakingRedelegationAmountInput")
    logAnalyticsEvent("StakeRedelegatePickValidator", { validator: validator.operatorAddress })
  }

  render () {
    return (
      <Screen preset="fixed">
        <Header
          headerTx="StakingRedelegationValidatorInputScreen.title"
          leftIcon="arrow-left"
          onLeftPress={this.onPressCloseButton}
        />
        <ValidatorList
          chain={this.props.chain}
          excluded={[this.props.navigation.getParam("from")]}
          filter="active"
          isScrolling={true}
          onPressItem={this.onPressValidator}
        />
      </Screen>
    )
  }
}
