import * as React from "react"
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputChangeEventData,
  View,
} from "react-native"
import { inject, observer } from "mobx-react"

import {
  ReferrerInputScreenStyle as Style,
} from "./referrer-input-screen.style"
import {
  ReferrerInputScreenProps as Props,
  ReferrerInputScreenState as State,
} from "./referrer-input-screen.props"

import { Button } from "../../components/button"
import { ButtonGroup } from "../../components/button-group"
import { Icon } from "../../components/icon"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"
import { sizes } from "../../components/text/text.sizes"

import { color } from "../../theme"

import { translate, translateWithFallbackText } from "../../i18n"

import { logAnalyticsEvent } from "../../utils/analytics"

const LIKER_ID_MIN_LENGTH = 5
const LIKER_ID_MAX_LENGTH = 20
const LIKER_ID_VALID_CHARACTERS = 'a-z0-9-_'
const LIKER_ID_REGEX = new RegExp(`^[${LIKER_ID_VALID_CHARACTERS}]{${LIKER_ID_MIN_LENGTH},${LIKER_ID_MAX_LENGTH}}$`)

@inject("userStore")
@observer
export class ReferrerInputScreen extends React.Component<Props, State> {
  state = {
    error: "",
    referrerID: "",
    isPosting: false,
  }

  /**
   * Validate the target input
   */
  private validate = (referrerID: string) => {
    let error = ""
    this.setState({ error })

    // Check for Liker Id
    if (referrerID.length < LIKER_ID_MIN_LENGTH) {
      error = translate("error.LIKER_ID_LENGTH_LIMIT_MIN", { count: LIKER_ID_MIN_LENGTH })
    } else if (referrerID.length > LIKER_ID_MAX_LENGTH) {
      error = translate("error.LIKER_ID_LENGTH_LIMIT_MAX", { count: LIKER_ID_MAX_LENGTH })
    } else if (!LIKER_ID_REGEX.test(referrerID)) {
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
    const referrerID = this.state.referrerID.trim()
    if (this.validate(referrerID)) {
      try {
        this.setState({ isPosting: true })
        await this.props.userStore.postUserAppReferrer(referrerID)
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

  private onReferrerIDChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    this.setState({
      error: "",
      referrerID: event.nativeEvent.text,
      isPosting: false,
    })
  }

  render () {
    const { referrerID: referrerId, isPosting } = this.state
    const { isEmailVerified } = this.props.userStore.appMeta
    return (
      <Screen
        preset="fixed"
        style={Style.Screen}
      >
        <View style={Style.ContentView}>
          <View style={Style.ReferrerIDInputLabelWrapper}>
            <Text
              tx="ReferrerInputScreen.referrerIdLabel"
              style={Style.ReferrerIDInputLabel}
            />
            <Text
              tx="ReferrerInputScreen.referrerIdHint"
              color="lighterCyan"
              size="small"
              align="center"
              weight="300"
            />
          </View>
          <ButtonGroup
            style={Style.ButtonGroup}
            prepend={
              <View
                key="receiverInput"
                style={Style.ReferrerIDInput}
              >
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  selectionColor={color.palette.likeCyan}
                  style={Style.ReferrerIDInputText}
                  value={referrerId}
                  autoFocus
                  onChange={this.onReferrerIDChange}
                  onSubmitEditing={this.onPressConfirmButton}
                />
              </View>
            }
          />
          <Button
            tx="common.confirm"
            isLoading={isPosting}
            style={Style.ConfirmButton}
            onPress={this.onPressConfirmButton}
          />
          {!isEmailVerified && this.renderEmailVerificationWarning()}
          {this.renderError()}
        </View>
        <View style={Style.BottomBar}>
          <Button
            preset="link"
            tx="common.Skip"
            isHidden={isPosting}
            onPress={this.onPressSkipButton}
          />
        </View>
      </Screen>
    )
  }

  private renderEmailVerificationWarning = () => {
    return (
      <View style={Style.ErrorView}>
        <Text
          tx="ReferrerInputScreen.emailVerificationHint"
          color="orange"
          prepend={
            <Icon
              name="alert-circle"
              color="orange"
              width={sizes.medium}
              height={sizes.medium}
            />
          }
          style={Style.ErrorText}
        />
      </View>
    )
  }

  private renderError = () => {
    const { error } = this.state
    return (
      <View style={Style.ErrorView}>
        <Text
          text={error}
          color="angry"
          isHidden={!error}
          prepend={
            <Icon
              name="alert-circle"
              color="angry"
              width={sizes.medium}
              height={sizes.medium}
            />
          }
          style={Style.ErrorText}
        />
      </View>
    )
  }
}
