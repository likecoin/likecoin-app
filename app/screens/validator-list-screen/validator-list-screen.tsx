import * as React from "react"
import { View } from "react-native"
import { inject, observer } from "mobx-react"

import {
  ValidatorListScreenProps as Props,
  ValidatorListScreenStyle as Style,
} from "."

import { Button } from "../../components/button"
import { Screen } from "../../components/screen"
import { Sheet } from "../../components/sheet"
import { Text } from "../../components/text"
import { ValidatorList } from "../../components/validator-list"

import { Validator } from "../../models/validator"
import { ChainStore } from "../../models/chain-store"

import { color } from "../../theme"

import { logAnalyticsEvent } from "../../utils/analytics"

@inject((allStores: any) => ({
  chain: allStores.chainStore as ChainStore,
}))
@observer
export class ValidatorListScreen extends React.Component<Props> {
  private onPressCloseButton = () => {
    this.props.navigation.pop()
  }

  private onPressValidator = (validator: Validator) => {
    logAnalyticsEvent('ValidatorListClickValidator', { validator: validator.moniker })
    this.props.navigation.navigate("Validator", {
      validator,
    })
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
            onPress={this.onPressCloseButton}
          />
        </View>
        <Text
          tx="ValidatorListScreen.Title"
          align="center"
          color="likeCyan"
          weight="bold"
        />
        <Sheet style={Style.Sheet}>
          <ValidatorList
            chain={this.props.chain}
            onPressItem={this.onPressValidator}
          />
        </Sheet>
      </Screen>
    )
  }
}
