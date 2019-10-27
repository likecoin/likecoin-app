import * as React from "react"
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputChangeEventData,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { TransferStore } from "../../models/transfer-store"

import { Button } from "../../components/button"
import { ButtonGroup } from "../../components/button-group"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"
import { sizes } from "../../components/text/text.sizes"

import { translate } from "../../i18n"
import { color, spacing } from "../../theme"

import CloseIcon from "../../assets/cross.svg"
import QRCodeIcon from "../../assets/qrcode-scan.svg"

export interface TransferTargetInputScreenProps extends NavigationScreenProps<{}> {
  transferStore: TransferStore,
}

const ROOT: ViewStyle = {
  flex: 1,
  padding: spacing[4],
  paddingTop: spacing[0],
}
const TOP_BAR: ViewStyle = {
  alignItems: "flex-start",
}
const CONTENT_VIEW: ViewStyle = {
  flexGrow: 1,
  justifyContent: "center",
  alignItems: "center",
}
const BUTTON_GROUP: ViewStyle = {
  marginTop: spacing[4],
  paddingHorizontal: spacing[1],
  width: 256,
}
const RECEIVER_TEXT_INPUT = StyleSheet.create({
  ROOT: {
    flex: 1,
  } as ViewStyle,
  TEXT: {
    color: color.palette.white,
    backgroundColor: color.transparent,
    fontSize: sizes.default,
    padding: spacing[3],
    flex: 1,
  } as TextStyle,
})
const BOTTOM_BAR: ViewStyle = {
  alignItems: "center",
}
const NEXT: ViewStyle = {
  width: BUTTON_GROUP.width,
}

@inject("transferStore")
@observer
export class TransferTargetInputScreen extends React.Component<TransferTargetInputScreenProps, {}> {
  componentDidMount() {
    this.props.transferStore.resetInput()
  }

  _onPressCloseButton = () => {
    this.props.navigation.pop()
  }

  _onPressQRCodeButton = () => {
    // TODO: Show QR code scanner
  }

  _onPressNextButton = () => {
    this.props.navigation.navigate("TransferAmountInput")
  }

  _onTargetAddressInputChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    this.props.transferStore.setTargetAddress(event.nativeEvent.text)
  }

  render () {
    const { targetAddress } = this.props.transferStore
    const bottomBarStyle = [
      BOTTOM_BAR,
      {
        opacity: targetAddress ? 1 : 0,
      } as ViewStyle,
    ]
    return (
      <Screen
        preset="scroll"
        backgroundColor={color.palette.likeGreen}
        style={ROOT}
      >
        <View style={TOP_BAR}>
          <Button
            preset="icon"
            onPress={this._onPressCloseButton}
          >
            <CloseIcon
              width={24}
              height={24}
              fill={color.palette.white}
            />
          </Button>
        </View>
        <View style={CONTENT_VIEW}>
          <Text
            tx="transferTargetInputScreen.targetInputLabel"
            align="center"
            color="likeCyan"
            weight="bold"
          />
          <ButtonGroup
            style={BUTTON_GROUP}
            prepend={
              <View
                key="receiverInput"
                style={RECEIVER_TEXT_INPUT.ROOT}
              >
                <TextInput
                  autoCorrect={false}
                  placeholder={translate("transferTargetInputScreen.targetInputPlaceholder")}
                  placeholderTextColor={color.palette.greyBlue}
                  returnKeyType="next"
                  selectionColor={color.palette.likeCyan}
                  style={RECEIVER_TEXT_INPUT.TEXT}
                  value={targetAddress}
                  onChange={this._onTargetAddressInputChange}
                />
              </View>
            }
            buttons={[
              {
                key: "scan",
                preset: "icon",
                children: (
                  <QRCodeIcon
                    width={16}
                    height={16}
                    fill={color.palette.white}
                  />
                ),
                onPress: this._onPressQRCodeButton,
              },
            ]}
          />
        </View>
        <View style={bottomBarStyle}>
          <Button
            tx="common.next"
            style={NEXT}
            onPress={this._onPressNextButton}
          />
        </View>
      </Screen>
    )
  }
}
