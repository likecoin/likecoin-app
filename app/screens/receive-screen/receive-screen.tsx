import { observer, inject } from "mobx-react"
import * as React from "react"
import { NavigationScreenProps } from "react-navigation"
import {
  Clipboard,
  Linking,
  Share,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import QRCode from 'react-native-qrcode-svg'

import { WalletStore } from "../../models/wallet-store"

import { Button } from "../../components/button"
import { Screen } from "../../components/screen"
import { Sheet } from "../../components/sheet"
import { Text } from "../../components/text"

import { color, spacing } from "../../theme"

export interface ReceiveScreenProps extends NavigationScreenProps<{}> {
  walletStore: WalletStore,
}

const SCREEN: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "space-between",
}
const HEADER_BAR: ViewStyle = {
  alignItems: "flex-end",
  width: "100%",
  paddingHorizontal: spacing[4],
  paddingVertical: spacing[1],
}
const INNER: ViewStyle = {
  alignItems: "stretch",
  padding: spacing[4],
}
const SHEET: ViewStyle = {
  alignItems: "center",
  maxWidth: 208,
  marginVertical: spacing[5],
  padding: spacing[5],
  paddingBottom: spacing[0],
  backgroundColor: color.palette.white,
}
const COPY_BUTTON: TextStyle = {
  marginTop: spacing[3],
  textAlign: "center",
}
const ADDRESS: TextStyle = {
  marginTop: spacing[4],
}
const BOTTOM_BAR: ViewStyle = {
  alignItems: "center",
  width: "100%",
  padding: spacing[3],
  backgroundColor: color.palette.white,
}

@inject("walletStore")
@observer
export class ReceiveScreen extends React.Component<ReceiveScreenProps, {}> {
  state = {
    isCopied: false
  }

  _onPressShareButton = () => {
    const { address: message } = this.props.walletStore
    Share.share({ message })
  }

  _onPressCopyButton = () => {
    const { address: message } = this.props.walletStore
    Clipboard.setString(message)
    this.setState({ isCopied: true })
  }

  _onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  _onPressViewExternalButton = () => {
    Linking.openURL(this.props.walletStore.address)
  }

  render () {
    const { address } = this.props.walletStore

    const copyButtonTx = this.state.isCopied ? "common.copied" : "common.copy"

    return (
      <Screen
        style={SCREEN}
        backgroundColor={color.primary}
        preset="fixed"
      >
        <View style={HEADER_BAR}>
          <Button
            preset="icon"
            icon="share"
            onPress={this._onPressShareButton}
          />
        </View>

        <View style={INNER}>
          <Text
            color="likeCyan"
            size="medium"
            align="center"
            weight="bold"
            tx="receiveScreen.shareYourAddress"
          />
          <Sheet style={SHEET}>
            <QRCode
              value={address}
              size={160}
            />
            <Text style={ADDRESS} text={address} />
            <Button
              textStyle={COPY_BUTTON}
              preset="link"
              tx={copyButtonTx}
              onPress={this._onPressCopyButton}
            />
          </Sheet>
          <Button
            preset="outlined"
            tx="common.viewOnBlockExplorer"
            onPress={this._onPressViewExternalButton}
          />
        </View>

        <View style={BOTTOM_BAR}>
          <Button
            preset="icon"
            icon="close"
            color="likeGreen"
            onPress={this._onPressCloseButton}
          />
        </View>
      </Screen>
    )
  }
}
