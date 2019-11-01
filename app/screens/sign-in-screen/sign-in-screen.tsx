import * as React from "react"
import { View, ViewStyle, TextStyle, SafeAreaView, Alert } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { UserLoginParams } from "../../services/api"

import { UserStore } from "../../models/user-store"

import { Button } from "../../components/button"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { Wallpaper } from "../../components/wallpaper"

import { color, spacing } from "../../theme"
import { translate } from "../../i18n"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TITLE_WRAPPER: TextStyle = {
  marginHorizontal: spacing[4],
  marginVertical: spacing[8],
}
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[6],
  alignItems: "stretch",
}
const FOOTNOTE: TextStyle = {
  color: color.palette.lightGrey,
  fontSize: 10,
  textAlign: "center",
  marginTop: spacing[2],
}

interface SignInScreenNavigationParams {
  signIn: UserLoginParams
}
export interface SignInScreenProps extends NavigationScreenProps<SignInScreenNavigationParams> {
  userStore: UserStore
}

@inject("userStore")
@observer
export class SignInScreen extends React.Component<SignInScreenProps, {}> {
  componentDidMount() {
    this._checkNavigationParams()
  }

  componentDidUpdate() {
    this._checkNavigationParams()
  }

  _checkNavigationParams() {
    const signInParams = this.props.navigation.getParam("signIn")
    if (signInParams) this._signIn(signInParams)
  }

  _signInWithAuthCore = async () => {
    await this.props.userStore.authCore.signIn()

    const {
      accessToken,
      idToken,
    } = this.props.userStore.authCore

    const {
      primaryEmail: email,
      displayName,
    } = this.props.userStore.authCore.profile

    try {
      await this._signIn({
        platform: "authcore",
        accessToken,
        idToken,
        email,
        displayName,
      })
    } catch (error) {
      Alert.alert("like.co sign in error")
      throw error
    }
  }

  _signIn = async (params: UserLoginParams) => {
    try {
      await this.props.userStore.login(params)
      this.props.navigation.navigate('LikerLandOAuth')
      this.props.userStore.fetchUserInfo()
    } catch (error) {
      switch (error.message) {
        case 'USER_NOT_FOUND':
          // TODO: Show registration form
          Alert.alert("Sign In", "User not found")
          break

        default:
      }
    }
  }

  _onPressAuthCoreButton = async () => {
    this.props.userStore.setIsSigningIn(true)
    try {
      await this._signInWithAuthCore()
    } catch (error) {
      if (error.message === "USER_CANCEL_AUTH") {
        // User cancelled auth, do nothing
      } else {
        __DEV__ && console.tron.error(`Error occurs when signing in with AuthCore: ${error}`, null)
        Alert.alert(`${translate("signInScreen.error")}: ${error}`)
      }
    } finally {
      this.props.userStore.setIsSigningIn(false)
    }
  }

  render() {
    const {
      currentUser,
      isSigningIn,
    } = this.props.userStore
    return (
      <View style={FULL}>
        <Wallpaper />
        <Screen
          style={CONTAINER}
          preset="fixed"
          backgroundColor={color.transparent}>
          <Text style={TITLE_WRAPPER}>
            <Text
              preset="header"
              color="white"
              size="large"
              weight="bold"
              align="center"
              tx="signInScreen.heading"
            />
          </Text>
        </Screen>
        <SafeAreaView>
          <View style={FOOTER_CONTENT}>
            <Button
              tx="signInScreen.signIn"
              preset="primary"
              isLoading={!!isSigningIn}
              isHidden={!!currentUser}
              onPress={this._onPressAuthCoreButton}
            />
            <Text style={FOOTNOTE}>Registration is not yet implemented</Text>
          </View>
        </SafeAreaView>
      </View>
    )
  }
}
