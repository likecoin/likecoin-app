import * as React from "react"
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputChangeEventData,
  TextStyle,
  View,
  ViewStyle,
  Alert,
} from "react-native"
import { NavigationStackScreenProps } from "react-navigation-stack"
import { inject, observer } from "mobx-react"

import { TransferStore } from "../../models/transfer-store"

import { Button } from "../../components/button"
import { ButtonGroup } from "../../components/button-group"
import { LoadingScreen } from "../../components/loading-screen"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"
import { sizes } from "../../components/text/text.sizes"

import { TransferNavigatorParams } from "../../navigation/transfer-navigator"

import { translate } from "../../i18n"
import { color, spacing } from "../../theme"

import { logAnalyticsEvent } from "../../utils/analytics"

export interface TransferMemoInputScreenProps
  extends NavigationStackScreenProps<TransferNavigatorParams> {
  txStore: TransferStore
}

const ROOT: ViewStyle = {
  flex: 1,
  padding: spacing[4],
  paddingTop: spacing[0],
}
const TOP_BAR: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
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
const MEMO_TEXT_INPUT = StyleSheet.create({
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
const BOTTOM_BAR: ViewStyle = {
  alignItems: "center",
}
const NEXT: ViewStyle = {
  width: BUTTON_GROUP.width,
}

@inject((allStores: any) => ({
  txStore: allStores.transferStore as TransferStore,
}))
@observer
export class TransferMemoInputScreen extends React.Component<
  TransferMemoInputScreenProps,
  {}
> {
  inputRef: React.RefObject<TextInput>

  constructor(props: TransferMemoInputScreenProps) {
    super(props)
    this.inputRef = React.createRef()
  }

  componentDidMount() {
    const skipToConfirm = this.props.navigation.getParam("skipToConfirm")
    if (skipToConfirm) {
      this.props.navigation.replace("TransferSigning", { skipToConfirm })
    } else {
      this.inputRef?.current?.focus()
    }
  }

  private onPressBackButton = () => {
    this.props.navigation.goBack()
  }

  private onPressSkipButton = () => {
    if (this.props.txStore.memo) {
      Alert.alert(
        translate("TransferMemoInputScreen.DiscardInputAlert"),
        undefined,
        [
          {
            text: translate("common.cancel"),
          },
          {
            text: translate("common.confirm"),
            onPress: () => {
              logAnalyticsEvent("TransferSkipMemo")
              this.props.txStore.setMemo("")
              this.props.navigation.push("TransferAmountInput")
            },
          },
        ],
      )
    } else {
      logAnalyticsEvent("TransferSkipMemo")
      this.props.navigation.push("TransferAmountInput")
    }
  }

  private onPressNextButton = async () => {
    logAnalyticsEvent("TransferConfirmMemo")
    this.props.txStore.setMemo(this.props.txStore.memo.trim())
    this.props.navigation.navigate("TransferAmountInput")
  }

  private onInputChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
  ) => {
    this.props.txStore.setMemo(event.nativeEvent.text)
  }

  render() {
    const skipToConfirm = this.props.navigation.getParam("skipToConfirm")
    if (skipToConfirm) {
      return <LoadingScreen />
    }

    return (
      <Screen
        preset="scroll"
        backgroundColor={color.palette.likeGreen}
        style={ROOT}
      >
        <View style={TOP_BAR}>
          <Button
            preset="icon"
            icon="back"
            color="white"
            onPress={this.onPressBackButton}
          />
          <Button
            preset="plain"
            tx="common.Skip"
            color="likeCyan"
            onPress={this.onPressSkipButton}
          />
        </View>
        <View style={CONTENT_VIEW}>
          <Text
            tx="TransferMemoInputScreen.InputLabel"
            align="center"
            color="likeCyan"
            weight="bold"
          />
          <ButtonGroup
            style={BUTTON_GROUP}
            prepend={
              <View key="receiverInput" style={MEMO_TEXT_INPUT.ROOT}>
                <TextInput
                  ref={this.inputRef}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor={color.palette.greyBlue}
                  returnKeyType="next"
                  selectionColor={color.palette.likeCyan}
                  style={MEMO_TEXT_INPUT.TEXT}
                  value={this.props.txStore.memo}
                  onChange={this.onInputChange}
                  onSubmitEditing={this.onPressNextButton}
                />
              </View>
            }
          />
        </View>
        <View style={BOTTOM_BAR}>
          <Button
            tx="common.next"
            style={NEXT}
            onPress={this.onPressNextButton}
          />
        </View>
      </Screen>
    )
  }
}
