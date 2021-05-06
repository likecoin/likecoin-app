import * as React from "react"
import { inject } from "mobx-react"
import { NavigationScreenProps } from "react-navigation"
import styled, { useTheme } from "styled-components/native"

import { AppVersionLabel as AppVersionLabelBase } from "../../components/app-version-label"
import { Avatar } from "../../components/avatar"
import { Button } from "../../components/button"
import { Icon } from "../../components/icon"
import { Header } from "../../components/header"
import { TableView } from "../../components/table-view/table-view"
import { TableViewCell } from "../../components/table-view/table-view-cell"
import { Screen as ScreenBase } from "../../components/screen"

import { UserStore } from "../../models/user-store"

import { color } from "../../theme"

import { logAnalyticsEvent } from "../../utils/analytics"

const Screen = styled(ScreenBase)`
  flex: 1;
`

const ScrollView = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.secondary};
`

const ScrollContentView = styled.View`
  padding-top: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  padding-left: ${({ theme }) => theme.spacing.lg};
  padding-right: ${({ theme }) => theme.spacing.lg};
`

const LanguageTableViewCell = styled(TableViewCell)`
  margin-top: ${({ theme }) => theme.spacing["2xl"]};
`

function LanguageIcon() {
  const theme = useTheme()
  return (
    <Icon
      color={theme.color.text.primary}
      name="public"
      width={18}
      height={18}
    />
  )
}

const PrimarySectionTableView = styled(TableView)`
  margin-top: ${({ theme }) => theme.spacing.lg};
`

const SecondarySectionTableView = styled(TableView)`
  margin-top: ${({ theme }) => theme.spacing["3xl"]};
`

const LogoutButtonWrapper = styled.View`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing["3xl"]};
`

const LogoutButton = styled(Button)`
  min-width: 144px;
`

const AppVersionLabel = styled(AppVersionLabelBase)`
  margin-top: ${({ theme }) => theme.spacing.xl};
`

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
    const { currentUser: user } = this.props.userStore
    return (
      <Screen
        preset="fixed"
        backgroundColor={color.primary}
      >
        <Header
          headerTx="settingsScreen.Panel.Settings.Header"
        />
        <ScrollView>
          <ScrollContentView>
            <Avatar
              size={94}
              src={user.avatarURL}
              isCivicLiker={user.isCivicLiker}
            />

            <LanguageTableViewCell
              titleTx="settingsScreen.Panel.Settings.Language"
              append={<LanguageIcon />}
              onPress={this.onPressLanguageSettings}
            />

            <PrimarySectionTableView>
              <TableViewCell
                titleTx="settingsScreen.Panel.Settings.Profile"
                onPress={this.onPressProfileSettings}
              />
              <TableViewCell
                titleTx="settingsScreen.Panel.Settings.Security"
                onPress={this.onPressSecuritySettings}
              />
              <TableViewCell
                titleTx="settingsScreen.Panel.Settings.WebsitesSignIn"
                onPress={this.onPressWebsiteSignIn}
              />
              <TableViewCell
                titleTx="settingsScreen.Panel.Settings.ContentJockey"
                onPress={this.onPressFollowSettings}
              />
            </PrimarySectionTableView>

            <SecondarySectionTableView>
              <TableViewCell
                titleTx="settingsScreen.termsOfUse"
                href="https://liker.land/eula"
              />
              <TableViewCell
                titleTx="settingsScreen.privacyPolicy"
                href="https://like.co/in/policies/privacy"
              />
              <TableViewCell
                titleTx="settingsScreen.openSourceLicense"
                href="https://github.com/likecoin/likecoin-app/wiki/libraries-we-use"
              />
              <TableViewCell
                titleTx="settingsScreen.contactUs"
                onPress={this.onPressContactUs}
              />
              <TableViewCell
                titleTx="settingsScreen.RateApp"
                onPress={this.onPressRateApp}
              />
            </SecondarySectionTableView>
            <LogoutButtonWrapper>
              <LogoutButton
                size="small"
                tx="welcomeScreen.logout"
                onPress={this.onClickLogout}
              />
            </LogoutButtonWrapper>
            <AppVersionLabel />
          </ScrollContentView>
        </ScrollView>
      </Screen>
    )
  }
}
