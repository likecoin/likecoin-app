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

import { UserStore } from "../../models/user-store"

import { Button } from "../../components/button"
import { ButtonGroup } from "../../components/button-group"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"
import { sizes } from "../../components/text/text.sizes"

import { color, spacing } from "../../theme"

import { translate, translateWithFallbackText } from "../../i18n"

import { logAnalyticsEvent } from "../../utils/analytics"

export interface ReferrerInputScreenProps extends NavigationScreenProps<{}> {
  userStore: UserStore,
}
export interface ReferrerInputScreenState {
  /**
   * The code of the error description which is looked up via i18n.
   */
  error: string
  isPosting: boolean
  referrerId: string
}

const LIKER_ID_MIN_LENGTH = 7
const LIKER_ID_MAX_LENGTH = 20
const LIKER_ID_VALID_CHARACTERS = 'a-z0-9-_'
const LIKER_ID_REGEX = new RegExp(`^[${LIKER_ID_VALID_CHARACTERS}]{${LIKER_ID_MIN_LENGTH},${LIKER_ID_MAX_LENGTH}}$`)

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
const LIKER_ID_INPUT = StyleSheet.create({
  LABEL: {
    fontSize: 28,
    fontWeight: "300",
    marginBottom: spacing[2],
  } as TextStyle,
  LABEL_WRAPPER: {
    width: BUTTON_GROUP.width,
  } as ViewStyle,
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
const REGISTER: ViewStyle = {
  width: BUTTON_GROUP.width,
}

@inject("userStore")
@observer
export class ReferrerInputScreen extends React.Component<ReferrerInputScreenProps, ReferrerInputScreenState> {
  constructor(props: ReferrerInputScreenProps) {
    super(props)
    this.state = {
      error: "",
      referrerId: "",
      isPosting: false,
    }
  }

  /**
   * Validate the target input
   */
  private validate = (referrerId: string) => {
    let error = ""
    this.setState({ error })

    // Check for Liker Id
    if (referrerId.length < LIKER_ID_MIN_LENGTH) {
      error = translate("error.LIKER_ID_LENGTH_LIMIT_MIN", { count: LIKER_ID_MIN_LENGTH })
    } else if (referrerId.length > LIKER_ID_MAX_LENGTH) {
      error = translate("error.LIKER_ID_LENGTH_LIMIT_MAX", { count: LIKER_ID_MAX_LENGTH })
    } else if (!LIKER_ID_REGEX.test(referrerId)) {
      error = translate("error.LIKER_ID_FORMAT_INVALID")
    }

    if (error) {
      this.setState({ error })
      return false
    }

    return true
  }

  private onPressSkipButton = async () => {
    logAnalyticsEvent('SkipReferrerId')
    this.props.navigation.navigate("App")
  }

  private onPressConfirmButton = async () => {
    // Trim before validation
    const referrerId = this.state.referrerId.trim()
    if (this.validate(referrerId)) {
      try {
        this.setState({ isPosting: true })
        await this.props.userStore.postUserAppReferrer(referrerId)
        logAnalyticsEvent('AddReferrerId')
        this.props.navigation.navigate('App')
      } catch (error) {
        const errorMessage = translateWithFallbackText(`error.${error.message}`, error.message)
        this.setState({ error: errorMessage })
        logAnalyticsEvent('AddReferrerIdFailed', { message: error.message })
      } finally {
        this.setState({ isPosting: false })
      }
    }
  }

  private onReferrerIdChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    this.setState({
      error: "",
      referrerId: event.nativeEvent.text,
      isPosting: false,
    })
  }

  render () {
    const { referrerId, isPosting } = this.state
    const { isEmailVerified } = this.props.userStore.appMeta
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
            onPress={this.onPressSkipButton}
          />
        </View>
        <View style={CONTENT_VIEW}>
          <View style={LIKER_ID_INPUT.LABEL_WRAPPER}>
            <Text
              tx="ReferrerInputScreen.referrerIdLabel"
              align="left"
              color="likeCyan"
              style={LIKER_ID_INPUT.LABEL}
            />
            <Text
              tx="ReferrerInputScreen.referrerIdHint"
              color="lighterCyan"
              size="default"
              weight="300"
            />
          </View>
          <ButtonGroup
            style={BUTTON_GROUP}
            prepend={
              <View
                key="receiverInput"
                style={LIKER_ID_INPUT.ROOT}
              >
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  selectionColor={color.palette.likeCyan}
                  style={LIKER_ID_INPUT.TEXT}
                  value={referrerId}
                  autoFocus
                  onChange={this.onReferrerIdChange}
                  onSubmitEditing={this.onPressConfirmButton}
                />
              </View>
            }
          />
          {!isEmailVerified && this._renderEmailVerificationWarning()}
          {this._renderError()}
        </View>
        <View style={BOTTOM_BAR}>
          <Button
            tx="common.confirm"
            isLoading={isPosting}
            style={REGISTER}
            onPress={this.onPressConfirmButton}
          />
        </View>
      </Screen>
    )
  }

  _renderEmailVerificationWarning = () => {
    return (
      <View style={ERROR.VIEW}>
        <Text
          tx="ReferrerInputScreen.emailVerificationHint"
          color="orange"
          prepend={
            <Icon
              name="alert-circle"
              fill={color.palette.orange}
              width={sizes.medium}
              height={sizes.medium}
            />
          }
          style={ERROR.TEXT}
        />
      </View>
    )
  }

  _renderError = () => {
    const { error } = this.state
    return (
      <View style={ERROR.VIEW}>
        <Text
          text={error}
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
