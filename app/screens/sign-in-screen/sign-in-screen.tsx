import * as React from "react"
import {
  Alert,
  Image,
  SafeAreaView,
  View,
} from "react-native"
import { NavigationScreenProps } from "react-navigation"
import FastImage from "react-native-fast-image"
import { inject, observer } from "mobx-react"
import i18n from "i18n-js"

import {
  SignInScreenStyle as Style,
} from "./sign-in-screen.style"

import SloganEn from "./slogan-en.svg"
import SloganZh from "./slogan-zh.svg"

import { logError } from "../../utils/error"
import { logAnalyticsEvent } from "../../utils/analytics"

import { UserLoginParams } from "../../services/api"

import { ChainStore } from "../../models/chain-store"
import { RootStore } from "../../models/root-store"
import { UserStore } from "../../models/user-store"

import { AppVersionLabel } from "../../components/app-version-label"
import { Button } from "../../components/button"
import { LoadingScreen } from "../../components/loading-screen"

import { translate } from "../../i18n"
import { color } from "../../theme"

const defaultBgImage = require("./bg.jpg")

interface SignInScreenNavigationParams {
  signIn: UserLoginParams
}

export interface SignInScreenProps extends NavigationScreenProps<SignInScreenNavigationParams> {
  userStore: UserStore
  chain: ChainStore
  bgImageURL?: string
}

@inject((allStores: any) => ({
  userStore: allStores.userStore as UserStore,
  chain: allStores.chainStore as ChainStore,
  bgImageURL: (allStores.rootStore as RootStore).env.appConfig.getValue("SIGNIN_SCREEN_BGIMAGE_URL"),
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
      if (
        error.error === "authcore.session.user_cancelled" || // iOS
        error.error === "a0.session.user_cancelled" // Android
      ) {
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
      this.props.userStore.authCore.setHasSignedIn(false)
    } finally {
      this.props.userStore.setIsSigningIn(false)
    }
  }

  private getSlogan() {
    switch (i18n.locale) {
      case "en":
        return SloganEn
      default:
        return SloganZh
    }
  }

  render() {
    const {
      bgImageURL,
      userStore: {
        isSigningIn,
        isSigningOut,
        authCore: {
          hasSignedIn: hasSignedInToAuthcore,
        },
      },
    } = this.props

    if (isSigningOut) {
      return <LoadingScreen />
    }

    const isLoading = !!isSigningIn || hasSignedInToAuthcore

    const Slogan = this.getSlogan()

    return (
      <View style={Style.Root}>
        <View style={Style.BgImageWrapper}>
          <Image
            source={defaultBgImage}
            style={Style.BgImage}
          />
          {!!bgImageURL &&
            <FastImage
              source={{
                uri: bgImageURL,
                // TODO: Fix type
                // https://github.com/DylanVann/react-native-fast-image/pull/654
                priority: FastImage.priority.low,
                cache: FastImage.cacheControl.cacheOnly as any,
              }}
              style={Style.BgImage}
            />
          }
        </View>
        <SafeAreaView style={Style.Footer}>
          <View style={Style.FooterContent}>
            <Slogan
              fill={color.palette.likeCyan}
              style={Style.Slogan}
            />
            <AppVersionLabel style={Style.Version} />
            <Button
              tx="signInScreen.signUp"
              preset="primary"
              isLoading={isLoading}
              onPress={this._onPressAuthCoreButton}
            />
            <Button
              tx="signInScreen.signIn"
              preset="link"
              color="likeCyan"
              isHidden={isLoading}
              style={Style.SignInButton}
              onPress={this._onPressAuthCoreButton}
            />
          </View>
        </SafeAreaView>
      </View>
    )
  }
}
