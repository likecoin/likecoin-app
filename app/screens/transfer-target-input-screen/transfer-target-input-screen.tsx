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
import { NavigationStackScreenProps } from "react-navigation-stack"
import { inject, observer } from "mobx-react"
import BigNumber from "bignumber.js"

import { ChainStore } from "../../models/chain-store"
import { RootStore } from "../../models/root-store"
import { TransferStore } from "../../models/transfer-store"

import { validateAccountAddress } from "../../services/cosmos/cosmos.utils"

import { Button } from "../../components/button"
import { ButtonGroup } from "../../components/button-group"
import { Icon } from "../../components/icon"
import { LoadingScreen } from "../../components/loading-screen"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"
import { sizes } from "../../components/text/text.sizes"

import { TransferNavigatorParams } from "../../navigation/transfer-navigator"

import { translate } from "../../i18n"
import { color, spacing } from "../../theme"

import { logAnalyticsEvent } from "../../utils/analytics"

export interface TransferTargetInputScreenProps extends NavigationStackScreenProps<TransferNavigatorParams> {
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
    const { fractionDenom, fractionDigits } = this.props.chain
    this.props.txStore.initialize(fractionDenom, fractionDigits)
    this.handleParams()
  }

  private handleParams = () => {
    const likerId = this.props.navigation.getParam("likerId")
    const address = this.props.navigation.getParam("address")
    const target = likerId || address
    if (target) {
      this.props.txStore.setReceiver(target)
    }

    const amount = this.props.navigation.getParam("amount")
    if (amount) {
      this.props.txStore.setAmount(new BigNumber(amount))
    }

    const memo = this.props.navigation.getParam("memo")
    if (memo) {
      this.props.txStore.setMemo(memo)
    }

    let skipToConfirm = this.props.navigation.getParam("skipToConfirm")
    if (target) {
      if (skipToConfirm) {
        this.validate()
          .then(() => {
            this.props.navigation.replace("TransferMemoInput", {
              skipToConfirm
            })
          })
          .catch(() => {
            this.props.navigation.setParams({})
          })
      }
    } else {
      skipToConfirm = false
    }
    this.props.navigation.setParams({ skipToConfirm })
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
      this.props.navigation.navigate("TransferMemoInput")
    }
  }

  private onTargetInputChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    this.props.txStore.setReceiver(event.nativeEvent.text)
  }

  render () {
    const {
      errorMessage,
      isFetchingLiker,
      target,
    } = this.props.txStore

    const skipToConfirm = this.props.navigation.getParam("skipToConfirm")
    if (skipToConfirm && !errorMessage) {
      return <LoadingScreen />
    }

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
            color="white"
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
                color: "white",
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
              color="angry"
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
