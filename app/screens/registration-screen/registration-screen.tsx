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
import { NavigationScreenProps } from "react-navigation"
import { Icon } from "react-native-ui-kitten"
import { inject, observer } from "mobx-react"

import { UserStore } from "../../models/user-store"
import { UserLoginParams } from "../../services/api"

import { Button } from "../../components/button"
import { ButtonGroup } from "../../components/button-group"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"
import { sizes } from "../../components/text/text.sizes"

import { color, spacing } from "../../theme"

import { translate, translateWithFallbackText } from "../../i18n"

export interface RegistrationScreenParams {
  params: UserLoginParams,
}

export interface RegistrationScreenProps extends NavigationScreenProps<RegistrationScreenParams> {
  userStore: UserStore,
}
export interface RegistrationScreenState {
  /**
   * The code of the error description which is looked up via i18n.
   */
  error: string

  likerId: string
}

const LIKER_ID_MIN_LENGTH = 7
const LIKER_ID_MAX_LENGTH = 20
const LIKER_ID_VALID_CHARACTERS = 'a-z0-9-_'
const LIKER_ID_CHARACTER_FILTER_REGEX = new RegExp(`[^${LIKER_ID_VALID_CHARACTERS}]`, "g")
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
  ROOT: {
    flex: 1,
  } as ViewStyle,
  LABEL_WRAPPER: {
    width: BUTTON_GROUP.width,
  } as ViewStyle,
  LABEL: {
    fontSize: 28,
    fontWeight: "300",
    marginBottom: spacing[2],
  } as TextStyle,
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
export class RegistrationScreen extends React.Component<RegistrationScreenProps, RegistrationScreenState> {
  constructor(props: RegistrationScreenProps) {
    super(props)

    const { email } = this.props.navigation.getParam("params")
    this.state = {
      error: "",
      likerId: email ? email.split("@")[0].toLowerCase().replace(LIKER_ID_CHARACTER_FILTER_REGEX, "") : "",
    }
  }

  /**
   * Validate the target input
   */
  private validate = (likerId: string) => {
    let error = ""
    this.setState({ error })

    // Check for Liker Id
    if (likerId.length < LIKER_ID_MIN_LENGTH) {
      error = translate("error.LIKER_ID_LENGTH_LIMIT_MIN", { count: LIKER_ID_MIN_LENGTH })
    } else if (likerId.length > LIKER_ID_MAX_LENGTH) {
      error = translate("error.LIKER_ID_LENGTH_LIMIT_MAX", { count: LIKER_ID_MAX_LENGTH })
    } else if (!LIKER_ID_REGEX.test(likerId)) {
      error = translate("error.LIKER_ID_FORMAT_INVALID")
    }

    if (error) {
      this.setState({ error })
      return false
    }

    return true
  }

  private onPressCloseButton = async () => {
    await this.props.userStore.authCore.signOut()
    this.props.navigation.goBack()
  }

  private onPressConfirmButton = async () => {
    // Trim before validation
    const likerId = this.state.likerId.trim()
    if (this.validate(likerId)) {
      const params = this.props.navigation.getParam("params")
      try {
        this.props.userStore.setIsSigningIn(true)
        await this.props.userStore.register({
          ...params,
          user: likerId,
        })
        this.props.navigation.navigate('LikerLandOAuth')
        this.props.userStore.fetchUserInfo()
      } catch (error) {
        const errorMessage = translateWithFallbackText(`error.${error.message}`, error.message)
        if (error.message === "REGISTRATION_EMAIL_ALREADY_USED") {
          Alert.alert(errorMessage, translate("RegistrationScreen.shouldSignInOnDesktop"))
        } else {
          this.setState({ error: errorMessage })
        }
      } finally {
        this.props.userStore.setIsSigningIn(false)
      }
    }
  }

  private onLikerIdChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    this.setState({
      error: "",
      likerId: event.nativeEvent.text,
    })
  }

  render () {
    const { isSigningIn } = this.props.userStore
    const { likerId } = this.state
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
          <View style={LIKER_ID_INPUT.LABEL_WRAPPER}>
            <Text
              tx="RegistrationScreen.likerIdLabel"
              align="left"
              color="likeCyan"
              style={LIKER_ID_INPUT.LABEL}
            />
            <Text
              tx="RegistrationScreen.likerIdHint"
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
                  value={likerId}
                  autoFocus
                  onChange={this.onLikerIdChange}
                  onSubmitEditing={this.onPressConfirmButton}
                />
              </View>
            }
          />
          {this._renderError()}
        </View>
        <View style={BOTTOM_BAR}>
          <Button
            tx="common.confirm"
            isLoading={isSigningIn}
            style={REGISTER}
            onPress={this.onPressConfirmButton}
          />
        </View>
      </Screen>
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
