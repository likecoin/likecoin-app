import * as React from "react"
import { View } from "react-native"
import { inject, observer } from "mobx-react"

import {
  StakingRedelegationValidatorInputScreenProps as Props,
  StakingRedelegationValidatorInputScreenStyle as Style,
} from "./"

import { RootStore } from "../../models/root-store"

import { Button } from "../../components/button"
import { Screen } from "../../components/screen"
import { Sheet } from "../../components/sheet"
import { Text } from "../../components/text"
import { ValidatorList } from "../../components/validator-list"

import { Validator } from "../../models/validator"

import { color } from "../../theme"
import { logAnalyticsEvent } from "../../utils/analytics"

@inject((rootStore: RootStore) => ({
  txStore: rootStore.stakingRedelegationStore,
  chain: rootStore.chainStore,
}))
@observer
export class StakingRedelegationValidatorInputScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    const { fractionDenom, fractionDigits, gasPrice } = props.chain
    props.txStore.initialize(fractionDenom, fractionDigits, gasPrice)
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
      <Screen
        preset="scroll"
        backgroundColor={color.palette.likeGreen}
        style={Style.Screen}
      >
        <View style={Style.Header}>
          <Button
            preset="icon"
            icon="close"
            color="white"
            onPress={this.onPressCloseButton}
          />
        </View>
        <Text
          tx="StakingRedelegationValidatorInputScreen.title"
          align="center"
          color="likeCyan"
          weight="bold"
        />
        <Sheet style={Style.Sheet}>
          <ValidatorList
            chain={this.props.chain}
            excluded={[this.props.navigation.getParam("from")]}
            onPressItem={this.onPressValidator}
          />
        </Sheet>
      </Screen>
    )
  }
}
