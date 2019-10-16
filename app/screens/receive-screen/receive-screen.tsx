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

import { Button } from "../../components/button"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"
import { color, spacing } from "../../theme"
import { UserStore } from "../../models/user-store"

import ShareIcon from "../../assets/share.svg"
import CloseIcon from "../../assets/cross.svg"

export interface ReceiveScreenProps extends NavigationScreenProps<{}> {
  userStore: UserStore,
}

const ROOT: ViewStyle = {
  flex: 1,
  backgroundColor: color.primary,
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
const CARD: ViewStyle = {
  alignItems: "center",
  maxWidth: 208,
  marginVertical: spacing[5],
  padding: spacing[5],
  paddingBottom: spacing[4],
  backgroundColor: color.palette.white,
  borderRadius: 14,
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

@inject("userStore")
@observer
export class ReceiveScreen extends React.Component<ReceiveScreenProps, {}> {
  state = {
    isCopied: false
  }

  _onPressShareButton = () => {
    const { cosmosAddress: message } = this.props.userStore.authCore
    Share.share({ message }) 
  }
  
  _onPressCopyButton = () => {
    const { cosmosAddress: message } = this.props.userStore.authCore
    Clipboard.setString(message)
    this.setState({ isCopied: true })
  }

  _onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  _onPressViewExternalButton = () => {
    Linking.openURL(this.props.userStore.authCore.bigDipperAccountURL)
  }

  render () {
    const { cosmosAddress: address } = this.props.userStore.authCore

    const copyButtonTx = this.state.isCopied ? "common.copied" : "common.copy"

    return (
      <View style={ROOT}>
        <Screen
          style={SCREEN}
          backgroundColor={color.transparent}
          preset="fixed"
        >
          <View style={HEADER_BAR}>
            <Button preset="icon">
              <ShareIcon
                width={24}
                height={24}
                fill={color.palette.white}
                onPress={this._onPressShareButton}
              />
            </Button>
          </View>

          <View style={INNER}>
            <Text
              color="likeCyan"
              size="medium"
              align="center"
              weight="bold"
              tx="receiveScreen.shareYourAddress"
            />
            <View style={CARD}>
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
            </View>
            <Button
              preset="outlined"
              tx="common.viewOnBlockExplorer"
              onPress={this._onPressViewExternalButton}
            />
          </View>

          <View style={BOTTOM_BAR}>
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
        </Screen>
      </View>
    )
  }
}
