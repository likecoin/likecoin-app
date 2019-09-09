import * as React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react";

import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { Wallpaper } from "../../components/wallpaper"
import { color } from "../../theme"
import { UserStore } from "../../models/user-store";

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = { justifyContent: "center", alignItems: "center" }
const LOADING: TextStyle = {
  fontSize: 14,
  textAlign: "center",
} 

export interface AuthLoadingScreenProps extends NavigationScreenProps<{}> {
  userStore: UserStore
}

@inject("userStore")
@observer
export class AuthLoadingScreen extends React.Component<AuthLoadingScreenProps, {}> {
  componentDidMount() {
    this.checkAuthState()
  }

  async checkAuthState() {
    const { currentUser } = this.props.userStore 
    if (currentUser) {
      try {
        await this.props.userStore.fetchUserInfo()
        this.props.navigation.navigate('App')
        return
      } catch {
        // No-op
      }
    }
    this.props.navigation.navigate('Auth')
  }

  render() {
    return (
      <View style={FULL}>
        <Wallpaper />
        <Screen
          style={CONTAINER}
          preset="fixed"
          backgroundColor={color.transparent}>
          <Text style={LOADING} text="Loading" />
        </Screen>
      </View>
    )
  }
}
