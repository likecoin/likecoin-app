import * as React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { RNCamera } from 'react-native-camera'
import { NavigationScreenProps } from "react-navigation"
import throttle from "lodash.throttle"

import { Button } from "../../components/button"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"

import { validateAccountAddress } from "../../services/cosmos/cosmos.utils"

import { color, spacing } from "../../theme"

import ScanFrame from "./scan-frame.svg"

const SCREEN: ViewStyle = {
  flex: 1,
}
const CAMERA: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}
const SCAN_FRAME: ViewStyle = {
  position: "relative",
  width: 244,
  aspectRatio: 1,
}
const HINT_TEXT: TextStyle = {
  position: "absolute",
  top: "100%",
  width: "100%",
  marginTop: spacing[5],
  fontSize: 18,
}
const BOTTOM_BAR: ViewStyle = {
  alignItems: "center",
  width: "100%",
  padding: spacing[3],
  backgroundColor: color.palette.white,
}
const FOOTER_VIEW: ViewStyle = {
  position: "absolute",
  bottom: 0,
  alignItems: "center",
  padding: spacing[5],
}
const NEXT: ViewStyle = {
  minWidth: 256,
}

export interface QrcodeScannerScreenProps extends NavigationScreenProps<{}> {
}

export class QrcodeScannerScreen extends React.Component<QrcodeScannerScreenProps, {}> {
  constructor(props: QrcodeScannerScreenProps) {
    super(props)
    this._onRead = throttle(this._onRead, 2000)
  }

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
        <RNCamera
          captureAudio={false}
          onBarCodeRead={this._onRead}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          style={CAMERA}
        >
          {this._renderScanFrame()}
          {this._renderFooterView()}
        </RNCamera>
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

  _renderScanFrame = () => {
    return (
      <View style={SCAN_FRAME}>
        <ScanFrame />
        <Text
          tx="qrcodeScannerScreen.hintText"
          color="white"
          weight="600"
          align="center"
          style={HINT_TEXT}
        />
      </View>
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
