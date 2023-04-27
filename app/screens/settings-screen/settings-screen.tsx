import * as React from "react"
import { TouchableOpacity } from "react-native"
import { inject, observer } from "mobx-react"
import { NavigationTabScreenProps } from "react-navigation-tabs"
import styled, { useTheme } from "styled-components/native"

import { AppVersionLabel as AppVersionLabelBase } from "../../components/app-version-label"
import { Avatar } from "../../components/avatar"
import { Button } from "../../components/button"
import { CommunityLinks as CommunityLinksBase } from "../../components/community-links"
import { Icon } from "../../components/icon"
import { Header } from "../../components/header"
import { TableView , TableViewCell } from "../../components/table-view"

import { Screen as ScreenBase } from "../../components/screen"

import { ExperimentalFeatureStore } from "../../models/experimental-feature-store"
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

const CommunityLinks = styled(CommunityLinksBase)`
  margin-top: ${({ theme }) => theme.spacing["2xl"]};
`

const Separator = styled.View`
  align-self: center;
  width: 60px;
  height: 1px;
  margin-top: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.color.separator};
`

const LogoutButtonWrapper = styled.View`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
`

const LogoutButton = styled(Button)`
  min-width: 144px;
`

const AppVersionLabel = styled(AppVersionLabelBase)`
  margin-top: ${({ theme }) => theme.spacing.xl};
`

const DeleteAccountButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing['3xl']};
  margin-bottom: ${({ theme }) => theme.spacing['xl']};
`

function WalletConnectIcon() {
  const theme = useTheme()
  return (
    <Icon
      color={theme.color.text.primary}
      name="wallet-connect"
      width={20}
      height={20}
    />
  )
}

export interface SettingsScreenProps extends NavigationTabScreenProps<{}> {
  userStore: UserStore
  experimentalFeatureStore: ExperimentalFeatureStore
}

@inject(
  "userStore",
  "experimentalFeatureStore",
)
@observer
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

  private onPressBookmarkScreen = () => {
    this.props.navigation.navigate("Bookmark")
    logAnalyticsEvent("SettingsClickBookmark")
  }

  private onPressDepub = () => {
    this.props.navigation.navigate("Depub")
    logAnalyticsEvent("SettingsClickDepub")
  }

  private onPressRateApp = () => {
    this.props.userStore.rateApp()
    logAnalyticsEvent("SettingsClickRateApp")
  }

  private onPressLanguageSettings = () => {
    this.props.navigation.navigate("LanguageSettings")
    logAnalyticsEvent("SettingsClickLanguageSettings")
  }

  private onPressExperimentalFeatures = () => {
    this.props.navigation.navigate("ExperimentalFeatures")
    logAnalyticsEvent("SettingsClickExperimentalFeatures")
  }

  private onPressWalletConnectSettings = () => {
    logAnalyticsEvent("SettingsClickWalletConnect")
    this.props.navigation.navigate("WalletConnectSettings")
  }

  private onPressDeleteAccount = () => {
    logAnalyticsEvent("DeleteAccount")
    this.props.navigation.navigate("AccountDelete")
  }

  private onPressSeedWordsExport = () => {
    logAnalyticsEvent("ExportSeedWords")
    this.props.navigation.navigate("SeedWordsExport")
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
            <TouchableOpacity onPress={this.props.userStore.updateUserAvatar}>
              <Avatar
                size={94}
                src={user.avatarURL}
                isCivicLiker={user.isCivicLiker}
              />
            </TouchableOpacity>

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
              {this.props.experimentalFeatureStore.shouldWalletConnectEnabled &&
                <TableViewCell
                  titleTx="settings_screen_walletConnect"
                  append={<WalletConnectIcon />}
                  onPress={this.onPressWalletConnectSettings}
                />
              }
              <TableViewCell
                titleTx="settings_screen_seed_words_export"
                onPress={this.onPressSeedWordsExport}
              />
            </PrimarySectionTableView>

            <PrimarySectionTableView>
              <TableViewCell
                titleTx="settings_screen_bookmark"
                onPress={this.onPressBookmarkScreen}
              />
              <TableViewCell
                titleTx="settings_screen_depub"
                onPress={this.onPressDepub}
              />
            </PrimarySectionTableView>

            <SecondarySectionTableView>
              {this.props.experimentalFeatureStore.shouldEnabled && (
                <TableViewCell
                  titleTx="settings_screen_experimental_features"
                  onPress={this.onPressExperimentalFeatures}
                />
              )}
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
            <CommunityLinks />
            <Separator />
            <LogoutButtonWrapper>
              <LogoutButton
                size="small"
                tx="welcomeScreen.logout"
                onPress={this.onClickLogout}
              />
            </LogoutButtonWrapper>
            <Separator />
            <DeleteAccountButton
              preset="link"
              color="angry"
              tx="settings_account_delete"
              onPress={this.onPressDeleteAccount}
            />
            <Separator />
            <AppVersionLabel />
          </ScrollContentView>
        </ScrollView>
      </Screen>
    )
  }
}
