import * as React from "react"
import { View, ViewStyle, TextStyle, SafeAreaView, Alert } from "react-native"
import { Button } from "react-native-ui-kitten";
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes as GOOGLE_STATUS_CODE
} from 'react-native-google-signin';
import FirebaseAuth, { Auth } from '@react-native-firebase/auth'

import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { Wallpaper } from "../../components/wallpaper"
import { color, spacing } from "../../theme"
import { UserStore } from "../../models/user-store";
import { UserLoginParams } from "../../services/api";

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TITLE_WRAPPER: TextStyle = {
  marginHorizontal: spacing[4],
  marginVertical: spacing[8],
}
const GOOGLE_SIGN_IN_BUTTON: ViewStyle = {
  width: '100%',
  height: 54,
}
const AUTHCORE_BUTTON_TEXT: TextStyle = {
  color: color.palette.likeCyan,
  fontSize: 12,
}
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
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
    GoogleSignin.configure({
      forceConsentPrompt: true
    })
    this._checkNavigationParams()
  }

  componentDidUpdate() {
    this._checkNavigationParams()
  }

  _checkNavigationParams() {
    const signInParams = this.props.navigation.getParam("signIn")
    if (signInParams) this._signIn(signInParams)
  }

  _signInWithGoogle = async () => {
    let googleIDToken: string
    let googleAccessToken: string
    try {
      await GoogleSignin.hasPlayServices()
      await GoogleSignin.signIn();
      ({
        idToken: googleIDToken,
        accessToken: googleAccessToken,
      } = await GoogleSignin.getTokens())
    } catch (error) {
      if (error.code === GOOGLE_STATUS_CODE.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === GOOGLE_STATUS_CODE.IN_PROGRESS) {
        Alert.alert("Sign-in is in progress")
      } else if (error.code === GOOGLE_STATUS_CODE.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Google Play service is not available")
      } else {
        Alert.alert("Firebase sign in error")
      }
      throw error
    }

    const credential = FirebaseAuth.GoogleAuthProvider.credential(googleIDToken, googleAccessToken)
    let firebaseIdToken: string
    try {
      firebaseIdToken = await this._signInToFirebase(credential)
    } catch (error) {
      Alert.alert("Firebase sign in error")
      throw error
    }

    try {
      await this._signIn({
        platform: "google",
        accessToken: googleAccessToken,
        firebaseIdToken,
      })
    } catch (error) {
      Alert.alert("like.co sign in error")
      throw error
    }
  }

  _signInToFirebase = async (credential: Auth.AuthCredential) => {
    const firebaseUserCredential = await FirebaseAuth().signInWithCredential(credential);
    return firebaseUserCredential.user.getIdToken()
  }

  _signInWithAuthCore = async () => {
    try {
      await this.props.userStore.authCore.signIn()
      await this.props.userStore.authCore.getCurrentUser()
    } catch (error) {
      Alert.alert("AuthCore sign in error")
      throw error
    }

    const {
      accessToken,
      idToken,
      profile: {
        primaryEmail: email,
        displayName,
      }
    } = this.props.userStore.authCore

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

  _onClickGoogleSignInButton = async () => {
    this.props.userStore.setIsSigningIn(true)
    try {
      this._signInWithGoogle()
    } catch (error) {
      __DEV__ && console.tron.error(error, null)
      this.props.userStore.setIsSigningIn(false)
    }
  }

  _onPressAuthCoreButton = () => {
    this.props.userStore.setIsSigningIn(true)
    try {
      this._signInWithAuthCore()
    } catch (error) {
      __DEV__ && console.tron.error(`${error}`, null)
      this.props.userStore.setIsSigningIn(false)
    }
  }

  render() {
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
            <GoogleSigninButton
              style={GOOGLE_SIGN_IN_BUTTON}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={this._onClickGoogleSignInButton}
              disabled={this.props.userStore.isSigningIn}
            />
            <Button
              onPress={this._onPressAuthCoreButton}
              textStyle={AUTHCORE_BUTTON_TEXT}
              appearance="ghost"
            >
              Sign in with AuthCore (Testnet)
            </Button>
            <Text style={FOOTNOTE}>Registration is not yet implemented</Text>
          </View>
        </SafeAreaView>
      </View>
    )
  }
}
