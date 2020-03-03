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

import { ChainStore } from "../../models/chain-store"
import { RootStore } from "../../models/root-store"
import { TransferStore } from "../../models/transfer-store"

import { validateAccountAddress } from "../../services/cosmos/cosmos.utils"

import { Button } from "../../components/button"
import { ButtonGroup } from "../../components/button-group"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"
import { sizes } from "../../components/text/text.sizes"

import { translate } from "../../i18n"
import { color, spacing } from "../../theme"

import { logAnalyticsEvent } from "../../utils/analytics"

export interface TransferTargetInputScreenParams {
  address: string,
  amount: string,
  memo: string,
  likerId: string,
  skipToConfirm: boolean,
}

export interface TransferTargetInputScreenProps extends NavigationScreenProps<TransferTargetInputScreenParams> {
  txStore: TransferStore,
  chain: ChainStore,
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

@inject((rootStore: RootStore) => ({
  txStore: rootStore.transferStore,
  chain: rootStore.chainStore,
}))
@observer
export class TransferTargetInputScreen extends React.Component<TransferTargetInputScreenProps, {}> {
  targetInputRef: React.RefObject<TextInput>

  constructor(props: TransferTargetInputScreenProps) {
    super(props)
    this.targetInputRef = React.createRef()
  }

  componentDidMount() {
    const { fractionDenom, fractionDigits, gasPrice } = this.props.chain
    this.props.txStore.initialize(fractionDenom, fractionDigits, gasPrice)
    this._mapParamsToProps()
  }

  componentDidUpdate(prepProps: TransferTargetInputScreenProps) {
    this._mapParamsToProps(prepProps)
  }

  _mapParamsToProps = (prepProps?: TransferTargetInputScreenProps) => {
    const prevAddress = prepProps && prepProps.navigation.getParam("address")
    const likerId = this.props.navigation.getParam("likerId")
    const address = this.props.navigation.getParam("address")
    const memo = this.props.navigation.getParam("memo")
    const amount = this.props.navigation.getParam("amount")
    const skipToConfirm = this.props.navigation.getParam("skipToConfirm")
    const target = likerId || address
    if (!prevAddress && target) {
      this.props.txStore.setTarget(target)
    }
    if (memo) this.props.txStore.setMemo(memo)
    if (!prevAddress && target && skipToConfirm) {
      this.validate().then(() => {
        this.props.navigation.navigate("TransferAmountInput", {
          amount,
          skipToConfirm,
        })
      })
    }
  }

  /**
   * Validate the target input
   */
  private validate = async () => {
    const { target } = this.props.txStore
    try {
      // Check for address
      if (validateAccountAddress(target)) {
        // Try to fetch the Liker for the wallet address
        await this.props.txStore.fetchLikerByWalletAddress()
      } else {
        // If not an address, then try to match a Liker ID
        await this.props.txStore.fetchLikerById()
        const { liker } = this.props.txStore
        if (!liker) {
          throw new Error("TRANSFER_INPUT_TARGET_INVALID")
        }
        if (!liker.cosmosWallet) {
          throw new Error("TRANSFER_TARGET_NO_WALLET")
        }
      }
    } catch (error) {
      this.targetInputRef.current.focus()
      return this.props.txStore.setError(error)
    }
    return true
  }

  private onPressCloseButton = () => {
    this.props.navigation.pop()
  }

  private onPressQRCodeButton = () => {
    logAnalyticsEvent('TransferClickQRCodeScan')
    this.props.navigation.navigate("QRCodeScan")
  }

  private onPressNextButton = async () => {
    // Trim before validation
    this.props.txStore.setTarget(this.props.txStore.target.trim())
    if (await this.validate()) {
      this.props.navigation.navigate("TransferAmountInput")
    }
  }

  private onTargetInputChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    this.props.txStore.setReceiver(event.nativeEvent.text)
  }

  render () {
    const { isFetchingLiker, target } = this.props.txStore
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
                  ref={this.targetInputRef}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder={translate("transferTargetInputScreen.targetInputPlaceholder")}
                  placeholderTextColor={color.palette.greyBlue}
                  returnKeyType="next"
                  selectionColor={color.palette.likeCyan}
                  style={RECEIVER_TEXT_INPUT.TEXT}
                  value={target}
                  onChange={this.onTargetInputChange}
                  onSubmitEditing={this.onPressNextButton}
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
    const { errorMessage } = this.props.txStore
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
