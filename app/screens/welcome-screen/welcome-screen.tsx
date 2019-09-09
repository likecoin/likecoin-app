import * as React from "react"
import { View, ViewStyle, TextStyle, SafeAreaView, Image, ImageStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react";

import { Text } from "../../components/text"
import { Button } from "../../components/button"
import { Screen } from "../../components/screen"
import { Wallpaper } from "../../components/wallpaper"
import { color, spacing } from "../../theme"
import { UserStore } from "../../models/user-store";
import { ReaderStore } from "../../models/reader-store";
import { ContentListItem } from "../../components/content-list-item";
import { Content } from "../../models/content";

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: "Montserrat",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const USER_INFO: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing[2],
  padding: spacing[2],
}
const AVATAR: ImageStyle = {
  width: 44,
  height: 44,
  borderRadius: 22,
  overflow: "hidden",
}
const DISPLAY_NAME: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
}
const LOGOUT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: "#5D2555",
}
const LOGOUT_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = { backgroundColor: "#20162D" }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}

export interface WelcomeScreenProps extends NavigationScreenProps<{}> {
  userStore: UserStore,
  readerStore: ReaderStore,
}

@inject(
  "userStore",
  "readerStore",
)
@observer
export class WelcomeScreen extends React.Component<WelcomeScreenProps, {}> {
  componentDidMount() {
    this.props.readerStore.fetchSuggestList()
  }

  onClickLogout = async () => {
    await this.props.userStore.logout()
    this.props.readerStore.clearAllLists()
    this.props.navigation.navigate('Auth')
  }

  _onPressContentItem = (content: Content) => {
    this.props.navigation.navigate('contentView', { content })
  }

  _renderContent = (content: Content) => (
    <ContentListItem
      key={content.url}
      content={content}
      onPressItem={this._onPressContentItem}
    />
  )

  render() {
    const { currentUser } = this.props.userStore
    const { suggestedList } = this.props.readerStore
    return (
      <View style={FULL}>
        <Wallpaper />
        <Screen
          style={CONTAINER}
          preset="scroll"
          backgroundColor={color.transparent}>
          {currentUser &&
            <View style={USER_INFO}>
              <Text
                style={DISPLAY_NAME}
                text={currentUser.displayName}
              />
              <Image
                style={AVATAR}
                source={{ uri: currentUser.avatarURL }}
              />
            </View>
          }
          {suggestedList.map(this._renderContent)}
        </Screen>
        <SafeAreaView style={FOOTER}>
          <View style={FOOTER_CONTENT}>
            <Button
              style={LOGOUT}
              textStyle={LOGOUT_TEXT}
              tx="welcomeScreen.logout"
              onPress={this.onClickLogout}
            />
          </View>
        </SafeAreaView>
      </View>
    )
  }
}
