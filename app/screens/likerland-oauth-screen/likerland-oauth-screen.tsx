import * as React from "react"
import { ViewStyle, View, NativeSyntheticEvent } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { WebViewNavigation } from 'react-native-webview'
import { inject } from "mobx-react"

import { LikeCoinWebView } from "../../components/likecoin-webview"
import { Wallpaper } from "../../components/wallpaper"
import { Screen } from "../../components/screen"
import { color } from "../../theme"
import { RootStore } from "../../models/root-store"
import { LIKERLAND_API_CONFIG } from "../../services/api/api-config"

const SIGNIN_URL = `${LIKERLAND_API_CONFIG.url}/users/login`

const FULL: ViewStyle = { flex: 1 }

export interface LikerLandOAuthScreenProps extends NavigationScreenProps<{}> {
  rootStore: RootStore,
}

@inject("rootStore")
export class LikerLandOAuthScreen extends React.Component<LikerLandOAuthScreenProps, {}> {
  _onLoadEnd = async (syntheticEvent: NativeSyntheticEvent<WebViewNavigation>) => {
    const { url } = syntheticEvent.nativeEvent
    const { rootStore } = this.props
    if (url.includes("/oauth/redirect")) {
      this.props.navigation.navigate("App")

      // Try to open the deferred deep link URL after sign in
      rootStore.openDeepLink()
    } else if (url.includes("/in/register")) {
      await rootStore.userStore.logout()
      rootStore.userStore.setIsSigningIn(false)
      this.props.navigation.goBack()
    }
  }

  render () {
    return (
      <View style={FULL}>
        <Wallpaper />
        <Screen
          preset="fixed"
          backgroundColor={color.transparent}
        >
          <LikeCoinWebView
            style={FULL}
            sharedCookiesEnabled={true}
            source={{ uri: SIGNIN_URL }}
            onLoadEnd={this._onLoadEnd}
          />
        </Screen>
      </View>
    )
  }
}
