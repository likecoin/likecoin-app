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
import { Icon } from "react-native-ui-kitten"
import { inject, observer } from "mobx-react"

import { TransferStore } from "../../models/transfer-store"
import { WalletStore } from "../../models/wallet-store"

import { validateAccountAddress } from "../../services/cosmos/cosmos.utils"

import { Button } from "../../components/button"
import { ButtonGroup } from "../../components/button-group"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"
import { sizes } from "../../components/text/text.sizes"

import { translate } from "../../i18n"
import { color, spacing } from "../../theme"

export interface TransferTargetInputScreenParams {
  address: string
}

export interface TransferTargetInputScreenProps extends NavigationScreenProps<TransferTargetInputScreenParams> {
  transferStore: TransferStore,
  walletStore: WalletStore,
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
    paddingHorizontal: spacing[3],
    flex: 1,
  } as TextStyle,
})
const ERROR = StyleSheet.create({
  TEXT: {
    flexGrow: 1,
  } as TextStyle,
  VIEW: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[4],
    flexDirection: "row",
    width: BUTTON_GROUP.width,
  } as ViewStyle,
})
const BOTTOM_BAR: ViewStyle = {
  alignItems: "center",
}
const NEXT: ViewStyle = {
  width: BUTTON_GROUP.width,
}

@inject(
  "transferStore",
  "walletStore",
)
@observer
export class TransferTargetInputScreen extends React.Component<TransferTargetInputScreenProps, {}> {
  state = {
    /**
     * The code of the error description which is looked up via i18n.
     */
    error: "",
  }

  componentDidMount() {
    const { fractionDenom, fractionDigits, gasPrice } = this.props.walletStore
    this.props.transferStore.initialize(fractionDenom, fractionDigits, gasPrice)
    this._mapParamsToProps()
  }

  componentDidUpdate(prepProps: TransferTargetInputScreenProps) {
    this._mapParamsToProps(prepProps)
  }

  _mapParamsToProps = (prepProps?: TransferTargetInputScreenProps) => {
    const prevAddress = prepProps && prepProps.navigation.getParam("address")
    const address = this.props.navigation.getParam("address")
    if (!prevAddress && address) {
      this.props.transferStore.setTarget(address)
    }
  }

  /**
   * Validate the target input
   */
  private validate = () => {
    let error = ""
    this.setState({ error })

    const { target } = this.props.transferStore

    // Check for address
    if (!validateAccountAddress(target)) {
      error = "INVALID_ACCOUNT_ADDRESS"
    }

    if (error) {
      this.setState({ error })
      return false
    }

    return true
  }

  private onPressCloseButton = () => {
    this.props.navigation.pop()
  }

  private onPressQRCodeButton = () => {
    this.props.navigation.navigate("QRCodeScan")
  }

  private onPressNextButton = () => {
    // Trim before validation
    this.props.transferStore.setTarget(this.props.transferStore.target.trim())
    if (this.validate()) {
      this.props.navigation.navigate("TransferAmountInput")
    }
  }

  private onTargetInputChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    this.props.transferStore.setTarget(event.nativeEvent.text)
  }

  render () {
    const { target } = this.props.transferStore
    const bottomBarStyle = [
      BOTTOM_BAR,
      {
        opacity: target ? 1 : 0,
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
            icon="close"
            onPress={this.onPressCloseButton}
          />
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
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder={translate("transferTargetInputScreen.targetInputPlaceholder")}
                  placeholderTextColor={color.palette.greyBlue}
                  returnKeyType="next"
                  selectionColor={color.palette.likeCyan}
                  style={RECEIVER_TEXT_INPUT.TEXT}
                  value={target}
                  onChange={this.onTargetInputChange}
                />
              </View>
            }
            buttons={[
              {
                key: "scan",
                preset: "icon",
                icon: "qrcode-scan",
                onPress: this.onPressQRCodeButton,
              },
            ]}
          />
          {this._renderError()}
        </View>
        <View style={bottomBarStyle}>
          <Button
            tx="common.next"
            style={NEXT}
            onPress={this.onPressNextButton}
          />
        </View>
      </Screen>
    )
  }

  _renderError = () => {
    const { error } = this.state
    const tx = `error.${error}`
    return (
      <View style={ERROR.VIEW}>
        <Text
          tx={tx}
          color="angry"
          isHidden={!error}
          prepend={
            <Icon
              name="alert-circle"
              fill={color.error}
              width={sizes.medium}
              height={sizes.medium}
            />
          }
          style={ERROR.TEXT}
        />
      </View>
    )
  }
}
