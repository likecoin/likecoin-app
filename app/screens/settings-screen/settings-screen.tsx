import * as React from "react"
import { observer, inject } from "mobx-react"
import { View, ViewStyle, Image, ImageStyle, ActivityIndicator, TextStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { APP_MARKETING_VERSION } from "react-native-dotenv"

import { Button } from "../../components/button"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"

import { color, spacing } from "../../theme"

import { UserStore } from "../../models/user-store"
import { ReaderStore } from "../../models/reader-store"

const SCREEN: ViewStyle = {
  flex: 1,
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}
const CONTENT_VIEW: ViewStyle = {

}
const USER_INFO: ViewStyle = {
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing[2],
  padding: spacing[2],
}
const AVATAR: ImageStyle = {
  overflow: "hidden",
  width: 64,
  height: 64,
  borderRadius: 32,
  marginBottom: spacing[3],
}
const LOGOUT: ViewStyle = {
  marginTop: spacing[4],
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}
const VERSION: TextStyle = {
  marginTop: spacing[4]
}
const LOADING_VIEW: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
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
  static navigationOptions = {
    headerStyle: {
      backgroundColor: color.primary,
    },
  }

  private onClickLogout = async () => {
    await this.props.userStore.logout()
    this.props.readerStore.clearAllLists()
    this.props.navigation.navigate('Auth')
  }

  render () {
    const { currentUser } = this.props.userStore
    return (
      <Screen
        style={SCREEN}
        preset="scroll"
        backgroundColor={color.transparent}
      >
        {currentUser ? (
          <View style={CONTENT_VIEW}>
            <View style={USER_INFO}>
              <Image
                style={AVATAR}
                source={{ uri: currentUser.avatarURL }}
              />
              <Text
                color="likeGreen"
                weight="600"
                size="medium"
                text={currentUser.displayName}
              />
              <Text
                color="grey9b"
                size="default"
                text={currentUser.email}
              />
            </View>
            <Button
              style={LOGOUT}
              tx="welcomeScreen.logout"
              onPress={this.onClickLogout}
            />
            <Text
              text={APP_MARKETING_VERSION}
              color="greyBlue"
              align="center"
              size="default"
              style={VERSION}
            />
          </View>
        ) : (
          <View style={LOADING_VIEW}>
            <ActivityIndicator
              color={color.primary}
              size="large"
            />
          </View>
        )}
      </Screen>
    )
  }
}
