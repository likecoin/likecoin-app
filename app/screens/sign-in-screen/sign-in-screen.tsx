import * as React from "react"
import { View, ViewStyle, TextStyle, SafeAreaView, Alert } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { logError } from "../../utils/error"
import { logAnalyticsEvent } from "../../utils/analytics"

import { UserLoginParams } from "../../services/api"

import { ChainStore } from "../../models/chain-store"
import { RootStore } from "../../models/root-store"
import { UserStore } from "../../models/user-store"

import { AppVersionLabel } from "../../components/app-version-label"
import { Button } from "../../components/button"
import { LoadingScreen } from "../../components/loading-screen"
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
const VERSION: ViewStyle = {
  marginTop: spacing[2],
}

interface SignInScreenNavigationParams {
  signIn: UserLoginParams
}
export interface SignInScreenProps extends NavigationScreenProps<SignInScreenNavigationParams> {
  userStore: UserStore
  chain: ChainStore
}

@inject((rootStore: RootStore) => ({
  userStore: rootStore.userStore,
  chain: rootStore.chainStore,
}))
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
    try {
      await this.props.userStore.authCore.signIn()
      this.props.chain.setupWallet(this.props.userStore.authCore.primaryCosmosAddress)
    } catch (error) {
      if (error.error === "authcore.session.user_cancelled") {
        // User cancelled auth, do nothing
      } else {
        logError(`Error occurs when signing in with Authcore: ${JSON.stringify(error)}`)
        Alert.alert(translate("signInScreen.errorAuthCore"), `${error.error_description || error}`)
      }
      return
    }

    const {
      accessToken,
      idToken,
      profile,
    } = this.props.userStore.authCore

    const {
      primaryEmail: email = "",
      displayName = "",
    } = profile || {}

    await this._signIn({
      platform: "authcore",
      accessToken,
      idToken,
      email,
      displayName,
    })
  }

  _signIn = async (params: UserLoginParams) => {
    try {
      logAnalyticsEvent('AuthCoreSignInSuccess')
      logAnalyticsEvent('OAuthSuccess')
      await this.props.userStore.login(params)
    } catch (error) {
      switch (error.message) {
        case 'USER_NOT_FOUND':
          logAnalyticsEvent('ShowRegisterForm')
          this.props.navigation.navigate("Register", { params })
          return

        default:
          logError(`Error occurs when signing in with like.co: ${error}`)
          Alert.alert(translate("signInScreen.errorLikeCo"), `${error}`)
          logAnalyticsEvent('LoginFail')
          return
      }
    }
    logAnalyticsEvent('login')
    this.props.navigation.navigate('LikerLandOAuth')
  }

  _onPressAuthCoreButton = async () => {
    try {
      this.props.userStore.setIsSigningIn(true)
      logAnalyticsEvent('AuthCoreSignInTry')
      await this._signInWithAuthCore()
    } catch (error) {
      logError(`Error occurs when signing in: ${error}`)
      Alert.alert(translate("signInScreen.error"), `${error}`)
    } finally {
      this.props.userStore.setIsSigningIn(false)
      this.props.userStore.authCore.setHasSignedIn(false)
    }
  }

  render() {
    const {
      isSigningIn,
      isSigningOut,
      authCore: {
        hasSignedIn: hasSignedInToAuthcore,
      },
    } = this.props.userStore

    if (isSigningOut) {
      return <LoadingScreen />
    }

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
              isLoading={!!isSigningIn || hasSignedInToAuthcore}
              onPress={this._onPressAuthCoreButton}
            />
            <AppVersionLabel style={VERSION} />
          </View>
        </SafeAreaView>
      </View>
    )
  }
}
