import * as React from "react"
import { View, ViewStyle } from "react-native"
import { QRScannerView } from "react-native-qrcode-scanner-view"
import { NavigationScreenProps } from "react-navigation"

import { Screen } from "../../components/screen"
import { Button } from "../../components/button"

import { validateAccountAddress } from "../../services/cosmos/cosmos.utils"

import { color, spacing } from "../../theme"
import { translate } from "../../i18n"

import CloseIcon from "../../assets/cross.svg"

const SCREEN: ViewStyle = {
  flex: 1,
}
const CORNER = {
  height: 70,
  width: 70,
  borderColor: color.palette.white,
}
const BOTTOM_BAR: ViewStyle = {
  alignItems: "center",
  width: "100%",
  padding: spacing[3],
  backgroundColor: color.palette.white,
}
const FOOTER_VIEW: ViewStyle = {
  alignItems: "center",
  padding: spacing[5],
}
const NEXT: ViewStyle = {
  minWidth: 256,
}

export interface QrcodeScannerScreenProps extends NavigationScreenProps<{}> {
}

export class QrcodeScannerScreen extends React.Component<QrcodeScannerScreenProps, {}> {
  _onRead = (event: any) => {
    if (validateAccountAddress(event.data)) {
      this.props.navigation.goBack()
      this.props.navigation.navigate("TransferTargetInput", { address: event.data })
    }
  }

  _onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  _onPressFooterViewButton = () => {
    this.props.navigation.navigate("Receive")
  }

  render () {
    return (
      <Screen
        style={SCREEN}
        backgroundColor={color.palette.likeGreen}
        preset="fixed"
      >
        <QRScannerView
          maskColor={color.transparent}
          cornerStyle={CORNER}
          hintText={translate("qrcodeScannerScreen.hintText")}
          isShowScanBar={false}
          renderFooterView={this._renderFooterView}
          onScanResult={this._onRead}
        />
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
    )
  }

  _renderFooterView = () => {
    return (
      <View style={FOOTER_VIEW}>
        <Button
          preset="primary"
          tx="qrcodeScannerScreen.showMyQRCode"
          style={NEXT}
          onPress={this._onPressFooterViewButton}
        />
      </View>
    )
  }
}
