import * as React from "react"
import { observer, inject } from "mobx-react"
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { NavigationScreenProps } from "react-navigation"

import { AppVersionLabel } from "../../components/app-version-label"
import { Button } from "../../components/button"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"

import { color, spacing } from "../../theme"

import { UserStore } from "../../models/user-store"
import { ReaderStore } from "../../models/reader-store"

const CONTENT_VIEW: ViewStyle = {
  padding: spacing[4],
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
const TABLE_CELL_BASE: ViewStyle = {
  justifyContent: "flex-start",
}
const SETTINGS_MENU = StyleSheet.create({
  TABLE: {
    borderRadius: 12,
    backgroundColor: color.palette.white,
    marginVertical: spacing[4],
  } as ViewStyle,
  TABLE_CELL: {
    ...TABLE_CELL_BASE,
    borderStyle: "solid",
    borderTopColor: color.palette.lighterGrey,
    borderTopWidth: StyleSheet.hairlineWidth,
  } as ViewStyle,
  TABLE_CELL_FIRST_CHILD: TABLE_CELL_BASE,
  TABLE_CELL_TEXT: {
    padding: spacing[2],
    paddingVertical: spacing[1],
    color: color.palette.grey4a,
    textAlign: "left",
    fontWeight: "normal",
  } as TextStyle,
})

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
  private onPressSubscription = () => {
    this.props.navigation.navigate("Subscription")
  }

  private onClickLogout = async () => {
    await this.props.userStore.logout()
    this.props.readerStore.clearAllLists()
    this.props.navigation.navigate("Auth")
  }

  render () {
    const {
      currentUser,
      iapStore: {
        isEnabled: isEnabledIAP
      },
    } = this.props.userStore
    return (
      <Screen
        preset="fixed"
        backgroundColor={color.primary}
      >
        <Header headerTx="settingsScreen.title" />
        {currentUser ? (
          <Screen
            style={CONTENT_VIEW}
            preset="scroll"
            backgroundColor="#F2F2F2"
            unsafe
          >
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
            {isEnabledIAP &&
              <View style={SETTINGS_MENU.TABLE}>
                <Button
                  preset="plain"
                  tx="settingsScreen.subscription"
                  textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
                  style={SETTINGS_MENU.TABLE_CELL_FIRST_CHILD}
                  onPress={this.onPressSubscription}
                />
              </View>
            }
            <View style={SETTINGS_MENU.TABLE}>
              <Button
                preset="plain"
                tx="settingsScreen.termsOfUse"
                link="https://liker.land/eula"
                textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
                style={SETTINGS_MENU.TABLE_CELL_FIRST_CHILD}
              />
              <Button
                preset="plain"
                tx="settingsScreen.privacyPolicy"
                link="https://like.co/in/policies/privacy"
                textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
                style={SETTINGS_MENU.TABLE_CELL}
              />
            </View>
            <Button
              style={LOGOUT}
              tx="welcomeScreen.logout"
              onPress={this.onClickLogout}
            />
            <AppVersionLabel style={VERSION} />
          </Screen>
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
