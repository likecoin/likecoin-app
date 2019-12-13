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
  private validate = async () => {
    const { target } = this.props.transferStore
    try {
      // Check for address
      if (validateAccountAddress(target)) {
        // Try to fetch the Liker for the wallet address
        await this.props.transferStore.fetchLikerByWalletAddress()
      } else {
        // If not an address, then try to match a Liker ID
        await this.props.transferStore.fetchLikerById()
        const { liker } = this.props.transferStore
        if (!liker) {
          throw new Error("TRANSFER_INPUT_TARGET_INVALID")
        }
        if (!liker.cosmosWallet) {
          throw new Error("TRANSFER_TARGET_NO_WALLET")
        }
      }
    } catch (error) {
      return this.props.transferStore.setError(error)
    }
    return true
  }

  private onPressCloseButton = () => {
    this.props.navigation.pop()
  }

  private onPressQRCodeButton = () => {
    this.props.navigation.navigate("QRCodeScan")
  }

  private onPressNextButton = async () => {
    // Trim before validation
    this.props.transferStore.setTarget(this.props.transferStore.target.trim())
    if (await this.validate()) {
      this.props.navigation.navigate("TransferAmountInput")
    }
  }

  private onTargetInputChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    this.props.transferStore.setReceiver(event.nativeEvent.text)
  }

  render () {
    const { isFetchingLiker, target } = this.props.transferStore
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
          {this.renderError()}
        </View>
        <View style={bottomBarStyle}>
          <Button
            tx="common.next"
            isLoading={isFetchingLiker}
            style={NEXT}
            onPress={this.onPressNextButton}
          />
        </View>
      </Screen>
    )
  }

  private renderError = () => {
    const { errorMessage } = this.props.transferStore
    return (
      <View style={ERROR.VIEW}>
        <Text
          text={errorMessage}
          color="angry"
          isHidden={!errorMessage}
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
