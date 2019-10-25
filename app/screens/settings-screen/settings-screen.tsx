import * as React from "react"
import { observer, inject } from "mobx-react"
import { View, ViewStyle, Image, ImageStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"

import { Button } from "../../components/button"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { Wallpaper } from "../../components/wallpaper"

import { color, spacing } from "../../theme"

import { UserStore } from "../../models/user-store"
import { ReaderStore } from "../../models/reader-store"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}
const USER_INFO: ViewStyle = {
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing[2],
  padding: spacing[2],
}
const AVATAR: ImageStyle = {
  width: 100,
  height: 100,
  borderRadius: 50,
  overflow: "hidden",
}
const LOGOUT: ViewStyle = {
  marginTop: spacing[4],
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}

export interface SettingsScreenProps extends NavigationScreenProps<{}> {
  userStore: UserStore,
  readerStore: ReaderStore,
}

@inject(
  "userStore",
  "readerStore",
)
@observer
export class SettingsScreen extends React.Component<SettingsScreenProps, {}> {
  _onClickLogout = async () => {
    await this.props.userStore.logout()
    this.props.readerStore.clearAllLists()
    this.props.navigation.navigate('Auth')
  }

  render () {
    const { currentUser } = this.props.userStore
    return (
      <View style={FULL}>
        <Wallpaper />
        <Screen
          style={CONTAINER}
          preset="scroll"
          backgroundColor={color.transparent}
        >
          {currentUser &&
            <View style={USER_INFO}>
              <Image
                style={AVATAR}
                source={{ uri: currentUser.avatarURL }}
              />
              <Text
                color="white"
                size="large"
                text={currentUser.displayName}
              />
              <Text
                color="grey9b"
                text={currentUser.email}
              />
            </View>
          }
          <Button
            style={LOGOUT}
            tx="welcomeScreen.logout"
            onPress={this._onClickLogout}
          />
        </Screen>
      </View>
    )
  }
}
