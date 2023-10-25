import * as React from "react"
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Image,
  SafeAreaView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native"
import { NavigationStackScreenProps } from "react-navigation-stack"
import FastImage, { ImageStyle } from "react-native-fast-image"
import { inject, observer } from "mobx-react"
import i18n from "i18n-js"

import {
  SignInScreenStyle as Style,
} from "./sign-in-screen.style"

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
import { NavigationEventSubscription } from "react-navigation"

const defaultBgImage = require("./bg.jpg")

interface SignInScreenNavigationParams {
  signIn: UserLoginParams
}

export interface SignInScreenProps extends NavigationStackScreenProps<SignInScreenNavigationParams> {
  userStore: UserStore
  chain: ChainStore
  bgImageURL?: string
}

export interface SignInScreenState {
  viewFadeAnim: Animated.Value
  bgImageScaleAnim: Animated.Value
  footerYAnim: Animated.Value
}

@inject((allStores: any) => ({
  userStore: allStores.userStore as UserStore,
  chain: allStores.chainStore as ChainStore,
  bgImageURL: (allStores.rootStore as RootStore).env.appConfig.getValue("SIGNIN_SCREEN_BGIMAGE_URL"),
}))
@observer
export class SignInScreen extends React.Component<SignInScreenProps, SignInScreenState> {
  state = {
    viewFadeAnim: new Animated.Value(0),
    bgImageScaleAnim: new Animated.Value(2),
    footerYAnim: new Animated.Value(200),
  }

  screenWillFocusSubscription: NavigationEventSubscription

  componentDidMount() {
    this._checkNavigationParams()
    this.screenWillFocusSubscription = this.props.navigation.addListener("willFocus", (payload) => {
      if ((payload.lastState as any).routeName === "Register") {
        // Sign out Authcore if users cancel Liker ID registration
        this.props.userStore.authCore.signOut()
      }
    })
    this.reveal()
  }

  componentDidUpdate() {
    this._checkNavigationParams()
  }

  componentWillUnmount() {
    if (this.screenWillFocusSubscription) {
      this.screenWillFocusSubscription.remove()
    }
  }

  private reveal() {
    const duration = 1500
    const easing = Easing.out(Easing.cubic)

    Animated.parallel([
      Animated.timing(
        this.state.viewFadeAnim,
        {
          toValue: 1,
          duration,
          easing,
          useNativeDriver: false
        }
      ),
      Animated.timing(
        this.state.bgImageScaleAnim,
        {
          toValue: 1,
          duration,
          easing,
          useNativeDriver: false
        }
      ),
      Animated.timing(
        this.state.footerYAnim,
        {
          toValue: 0,
          duration: duration + 100,
          easing,
          useNativeDriver: false
        }
      )
    ]).start()
  }

  _checkNavigationParams() {
    const signInParams = this.props.navigation.getParam("signIn")
    if (signInParams) this._signIn(signInParams)
  }

  _authWithAuthCore = async ({ isSignUp }) => {
    try {
      if (isSignUp) {
        await this.props.userStore.authCore.register()
      } else {
        await this.props.userStore.authCore.signIn()
      }
      this.props.chain.reset()
      this.props.chain.setupWallet(this.props.userStore.authCore.primaryCosmosAddress)
    } catch (error) {
      if (
        error.error === "authcore.session.user_cancelled" || // iOS
        error.error === "a0.session.user_cancelled" // Android
      ) {
        // User cancelled auth, do nothing
      } else {
        this.props.userStore.authCore.setHasSignedIn(false)
        logError(`Error occurs when signing in with Authcore: ${error.error_description || error}`)
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
    this.props.navigation.navigate('PostSignIn')
  }

  private _onPressAuthCoreAuthButton = async ({ isSignUp }) => {
    try {
      this.props.userStore.setIsSigningIn(true)
      logAnalyticsEvent(isSignUp ? 'AuthCoreSignUpTry' : 'AuthCoreSignInTry')
      await this._authWithAuthCore({ isSignUp })
    } catch (error) {
      logError(`Error occurs when signing in: ${error}`)
      Alert.alert(translate("signInScreen.error"), `${error}`)
      this.props.userStore.authCore.setHasSignedIn(false)
    } finally {
      this.props.userStore.setIsSigningIn(false)
    }
  }

  _onPressAuthCoreSignUpButton = () => {
    this._onPressAuthCoreAuthButton({ isSignUp: true })
  }

  _onPressAuthCoreSignInButton = () => {
    this._onPressAuthCoreAuthButton({ isSignUp: false })
  }


  private getSloganSrc() {
    switch (i18n.locale) {
      case "en":
        return require("./slogan-en.png")
      default:
        return require("./slogan-zh.png")
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
      return <LoadingScreen tx="signingOut" />
    }

    const isLoading = !!isSigningIn || hasSignedInToAuthcore

    const bgImageStyle = {
      opacity: this.state.viewFadeAnim,
      transform: [{ scale: this.state.bgImageScaleAnim }],
    } as any as ViewStyle

    const footerStyle = {
      opacity: this.state.viewFadeAnim,
      transform: [{ translateY: this.state.footerYAnim }],
    }

    return (
      <View style={Style.Root}>
        <SafeAreaView style={Style.Footer}>
          <Animated.View style={[Style.FooterContent, footerStyle]}>
            <Image
              source={this.getSloganSrc()}
              resizeMode="contain"
              style={Style.Slogan}
            />
            <AppVersionLabel style={Style.Version} />
            <View style={Style.SignInButtonContainer}>
              {isLoading &&
                <ActivityIndicator
                  size="large"
                  color={color.palette.likeCyan}
                  style={Style.SignInActivityIndicator}
                />
              }
              <Button
                tx="signInScreen.signUp"
                preset="primary"
                isHidden={isLoading}
                onPress={this._onPressAuthCoreSignUpButton}
              />
              <Button
                tx="signInScreen.signIn"
                preset="link"
                color="likeGreen"
                isHidden={isLoading}
                style={Style.SignInButton}
                onPress={this._onPressAuthCoreSignInButton}
              />
            </View>
          </Animated.View>
        </SafeAreaView>
        <Animated.View style={[Style.BgImageWrapper, bgImageStyle]}>
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
              style={Style.BgImage as StyleProp<ImageStyle>}
            />
          }
        </Animated.View>
      </View>
    )
  }
}
