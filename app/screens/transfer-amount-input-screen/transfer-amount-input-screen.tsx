import * as React from "react"
import {
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { TransferStore } from "../../models/transfer-store"
import { WalletStore } from "../../models/wallet-store"

import { AmountInputPad } from "../../components/amount-input-pad"
import { Button } from "../../components/button"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"

import { color, spacing } from "../../theme"

import CloseIcon from "../../assets/cross.svg"
import TransferGraph from "../../assets/graph/transfer.svg"

import { formatLIKE } from "../../utils/number"

export interface TransferAmountInputScreenProps extends NavigationScreenProps<{}> {
  transferStore: TransferStore,
  walletStore: WalletStore,
}

const ROOT: ViewStyle = {
  flex: 1,
  padding: spacing[4],
}
const SHEET: ViewStyle = {
  flex: 1,
  backgroundColor: color.palette.white,
  borderRadius: 14,
  padding: spacing[3],
}
const TOP_BAR: ViewStyle = {
  alignItems: "flex-start",
}
const CONTENT_VIEW: ViewStyle = {
  flexGrow: 1,
  padding: spacing[4],
  paddingTop: spacing[2],
}
const HEADER: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingBottom: spacing[4],
  borderBottomColor: color.palette.lightGrey,
  borderBottomWidth: StyleSheet.hairlineWidth,
}
const AVAILABLE = StyleSheet.create({
  ROOT: {
    flexGrow: 1,
  } as ViewStyle,
  AMOUNT: {
    fontSize: 18,
    marginBottom: spacing[2],
  } as TextStyle,
})
const AMOUNT_INPUT_PAD: ViewStyle = {
  flexGrow: 1,
}
const NEXT: ViewStyle = {
  marginTop: spacing[3],
}

@inject(
  "transferStore",
  "walletStore",
)
@observer
export class TransferAmountInputScreen extends React.Component<TransferAmountInputScreenProps, {}> {
  _onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  _onPressNextButton = async () => {
    this.props.navigation.navigate("TransferSigning")
  }

  _onAmountInputChange = (amount: string) => {
    this.props.transferStore.setAmount(amount)
  }

  render () {
    const { amount } = this.props.transferStore
    return (
      <Screen
        preset="fixed"
        backgroundColor={color.palette.likeGreen}
        style={ROOT}
      >
        <View style={SHEET}>
          <View style={TOP_BAR}>
            <Button
              preset="icon"
              onPress={this._onPressCloseButton}
            >
              <CloseIcon
                width={24}
                height={24}
                fill={color.palette.likeGreen}
              />
            </Button>
          </View>
          <View style={CONTENT_VIEW}>
            {this._renderHeader()}
            <AmountInputPad
              value={amount}
              style={AMOUNT_INPUT_PAD}
              onChange={this._onAmountInputChange}
            />
            <Button
              tx="common.next"
              style={NEXT}
              onPress={this._onPressNextButton}
            />
          </View>
        </View>
      </Screen>
    )
  }

  _renderHeader = () => {
    return (
      <View style={HEADER}>
        <View style={AVAILABLE.ROOT}>
          <Text
            text={formatLIKE(this.props.walletStore.formattedBalance)}
            style={AVAILABLE.AMOUNT}
          />
          <Text tx="transferAmountInputScreen.available" />
        </View>
        <TransferGraph
          width={68}
          height={50}
          fill={color.palette.likeGreen}
        />
      </View>
    )
  }
}
