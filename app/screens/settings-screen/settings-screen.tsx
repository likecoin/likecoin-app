import * as React from "react"
import { inject } from "mobx-react"
import { View } from "react-native"
import { NavigationScreenProps } from "react-navigation"

import {
  LOGOUT,
  VERSION,
  SETTINGS_MENU,
  SettingScreenStyle as Style,
} from "./settings-screen.style"

import { AppVersionLabel } from "../../components/app-version-label"
import { Button } from "../../components/button"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"

import { UserStore } from "../../models/user-store"

import { color } from "../../theme"

import { logAnalyticsEvent } from "../../utils/analytics"

export interface SettingsScreenProps extends NavigationScreenProps<{}> {
  userStore: UserStore
}

@inject("userStore")
export class SettingsScreen extends React.Component<SettingsScreenProps, {}> {
  private onPressProfileSettings = () => {
    this.props.navigation.navigate("ProfileSettings")
    logAnalyticsEvent("SettingsClickProfileSettings")
  }

  private onPressSecuritySettings = () => {
    this.props.userStore.authCore.openSettingsWidget()
    logAnalyticsEvent("SettingsClickSecuritySettings")
  }

  private onClickLogout = async () => {
    this.props.userStore.logout()
    logAnalyticsEvent("SignOut")
  }

  private onPressContactUs = () => {
    this.props.navigation.navigate("CrispSupport")
  }

  private onPressFollowSettings = () => {
    this.props.navigation.navigate("FollowSettings")
    logAnalyticsEvent("SettingsClickFollowSettings")
  }

  private onPressWebsiteSignIn = () => {
    this.props.navigation.navigate("WebsiteSignIn")
    logAnalyticsEvent("SettingsClickWebsiteSignIn")
  }

  private onPressRateApp = () => {
    this.props.userStore.rateApp()
    logAnalyticsEvent("SettingsClickRateApp")
  }

  private onPressLanguageSettings = () => {
    this.props.navigation.navigate("LanguageSettings")
    logAnalyticsEvent("SettingsClickLanguageSettings")
  }

  render() {
    return (
      <Screen
        preset="scroll"
        backgroundColor={color.palette.greyf2}
        wrapperBackgroundColor={color.primary}
        style={Style.Root}
      >
        {this.renderBody()}
      </Screen>
    )
  }

  renderBody() {
    return (
      <View style={Style.Body}>
        <Text
          tx="settingsScreen.Panel.Settings.Header"
          style={Style.SubHeader}
        />
        <View style={SETTINGS_MENU.TABLE}>
          <Button
            preset="plain"
            tx="settingsScreen.Panel.Settings.Profile"
            textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
            style={SETTINGS_MENU.TABLE_CELL_FIRST_CHILD}
            onPress={this.onPressProfileSettings}
          />
          <Button
            preset="plain"
            tx="settingsScreen.Panel.Settings.Security"
            textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
            style={SETTINGS_MENU.TABLE_CELL}
            onPress={this.onPressSecuritySettings}
          />
          <Button
            preset="plain"
            tx="settingsScreen.Panel.Settings.ContentJockey"
            textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
            style={SETTINGS_MENU.TABLE_CELL}
            onPress={this.onPressFollowSettings}
          />
          <Button
            preset="plain"
            tx="settingsScreen.Panel.Settings.WebsitesSignIn"
            textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
            style={SETTINGS_MENU.TABLE_CELL}
            onPress={this.onPressWebsiteSignIn}
          />
          <Button
            preset="plain"
            tx="settingsScreen.Panel.Settings.Language"
            textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
            style={SETTINGS_MENU.TABLE_CELL}
            onPress={this.onPressLanguageSettings}
          />
        </View>
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
          <Button
            preset="plain"
            tx="settingsScreen.openSourceLicense"
            link="https://github.com/likecoin/likecoin-app/wiki/libraries-we-use"
            textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
            style={SETTINGS_MENU.TABLE_CELL}
          />
          <Button
            preset="plain"
            tx="settingsScreen.contactUs"
            textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
            style={SETTINGS_MENU.TABLE_CELL}
            onPress={this.onPressContactUs}
          />
          <Button
            preset="plain"
            tx="settingsScreen.RateApp"
            textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
            style={SETTINGS_MENU.TABLE_CELL}
            onPress={this.onPressRateApp}
          />
        </View>
        <Button
          style={LOGOUT}
          tx="welcomeScreen.logout"
          onPress={this.onClickLogout}
        />
        <AppVersionLabel style={VERSION} />
      </View>
    )
  }
}
