import * as React from "react"
import { ViewStyle, View, Alert } from "react-native"
import { AUTHCORE_AUTH_URL } from "react-native-dotenv"
import { NavigationScreenProps } from "react-navigation"
import { WebView, WebViewMessageEvent } from 'react-native-webview'
import { inject } from "mobx-react"

import { Wallpaper } from "../../components/wallpaper"
import { Screen } from "../../components/screen"
import { color } from "../../theme"
import { UserStore } from "../../models/user-store"

const FULL: ViewStyle = { flex: 1 }

export interface AuthCoreAuthScreenProps extends NavigationScreenProps<{}> {
  userStore: UserStore
}

@inject("userStore")
export class AuthCoreAuthScreen extends React.Component<AuthCoreAuthScreenProps, {}> {
  _onMessage = (event: WebViewMessageEvent) => {
    let message: {
      type?: string
      data?: any
    } = {}
    try {
      message = JSON.parse(event.nativeEvent.data)
    } catch {
      // no-op
    }
    switch (message.type) {
      case 'loaded':
        break

      case 'success':
        this._signIn(message.data)
        break

      default:
      case 'error':
        __DEV__ && console.tron.error(message.data, null)
        if (this.props.userStore.currentUser) {
          Alert.alert("AuthCore", "Error occurs in authorization.", [
            {
              text: "Back",
              onPress: () => {
                this.props.navigation.navigate("SignIn")
              }
            },
          ])
        }
    }
  }

  _signIn = async (data: any) => {
    const {
      access_token: accessToken,
      current_user: currentUser,
      id_token: idToken,
    } = data
    __DEV__ && console.tron.log(data)

    const {
      primaryEmail: email,
      displayName,
      suggestedName: username,
    } = currentUser

    await this.props.userStore.authCore.init(
      accessToken,
      idToken,
      currentUser,
    )

    this.props.navigation.navigate("SignIn", {
      signIn: {
        platform: "authcore",
        accessToken,
        idToken,
        username,
        email,
        displayName,
      }
    })
  }

  render () {
    return (
      <View style={FULL}>
        <Wallpaper />
        <Screen
          preset="fixed"
          backgroundColor={color.transparent}
        >
          <WebView
            style={FULL}
            source={{ uri: AUTHCORE_AUTH_URL }}
            onMessage={this._onMessage}
          />
        </Screen>
      </View>
    )
  }
}
