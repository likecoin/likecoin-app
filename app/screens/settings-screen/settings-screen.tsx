import * as React from "react"
import { inject } from "mobx-react"
import {
  Linking,
  View,
} from "react-native"
import { NavigationScreenProps } from "react-navigation"

import {
  LOGOUT,
  VERSION,
  SETTINGS_MENU,
  SettingScreenStyle as Style,
} from "./settings-screen.style"

import { SettingsScreenStatisticsPanel } from "./settings-screen-statistics-panel"
import { SettingsScreenUserInfoPanel } from "./settings-screen-user-info-panel"
import { SettingsScreenWalletPanel } from "./settings-screen-wallet-panel"

import { AppVersionLabel } from "../../components/app-version-label"
import { Button } from "../../components/button"
import { ExtendedView } from "../../components/extended-view"
import { Screen } from "../../components/screen"

import { RootStore } from "../../models/root-store"

import { color } from "../../theme"

import { logAnalyticsEvent } from "../../utils/analytics"

export interface SettingsScreenProps extends NavigationScreenProps<{}> {
  rootStore: RootStore
}

@inject((allStores: any) => ({
  rootStore: allStores.rootStore as RootStore,
}))
export class SettingsScreen extends React.Component<SettingsScreenProps, {}> {
  private onPressSubscription = () => {
    this.props.navigation.navigate("Subscription")
  }

  private onPressAuthcoreSettings = () => {
    this.props.rootStore.userStore.authCore.openSettingsWidget({
      company: "Liker ID",
      logo: "https://like.co/favicon.png",
      primaryColour: color.primary,
      successColour: color.primary,
      dangerColour: color.palette.angry,
    })
  }

  private onClickLogout = async () => {
    this.props.rootStore.signOut()
    logAnalyticsEvent('SignOut')
  }

  private onPressContactUs = () => {
    this.props.navigation.navigate("CrispSupport")
  }

  private onPressFollowSettings = () => {
    logAnalyticsEvent('SettingsClickFollowSettings')
    this.props.navigation.navigate("FollowSettings")
  }

  private onPressReferral = () => {
    logAnalyticsEvent('SettingsClickReferral')
    this.props.navigation.navigate("Referral")
  }

  private onPressQRCodeButton = () => {
    logAnalyticsEvent('SettingsClickQRCodeScan')
    this.props.navigation.navigate("QRCodeScan")
  }

  private onPressWalletButton = () => {
    logAnalyticsEvent('SettingsClickWallet')
    this.props.navigation.navigate("Wallet")
  }

  private onPressStatisticsSupportedSection = () => {
    logAnalyticsEvent('SettingsClickStatsSupported')
    this.props.navigation.navigate("StatisticsSupported")
  }

  private onPressStatisticsRewardedSection = () => {
    logAnalyticsEvent('SettingsClickStatsRewarded')
    this.props.navigation.navigate("StatisticsRewarded")
  }

  private onPressGetRewardsButton = () => {
    Linking.openURL("https://like.co/in/creator")
  }

  private onPressWebsiteSignIn = () => {
    logAnalyticsEvent('SettingsClickWebsiteSignIn')
    this.props.navigation.navigate("WebsiteSignIn")
  }

  private onPressRateApp = () => {
    logAnalyticsEvent('SettingsClickRateApp')
    this.props.rootStore.userStore.rateApp()
  }

  render () {
    return (
      <Screen
        preset="scroll"
        backgroundColor={color.palette.greyf2}
        wrapperBackgroundColor={color.primary}
        style={Style.Root}
      >
        {this.renderHeader()}
        {this.renderBody()}
      </Screen>
    )
  }

  renderHeader() {
    return (
      <ExtendedView
        backgroundColor={color.primary}
        style={Style.Header}
      >
        <SettingsScreenUserInfoPanel />
      </ExtendedView>
    )
  }

  renderBody() {
    const {
      currentUser: {
        isCivicLiker,
      },
      iapStore: {
        isEnabled: isIAPEnabled
      },
    } = this.props.rootStore.userStore
    return (
      <View style={Style.Body}>
        <SettingsScreenWalletPanel
          onPress={this.onPressWalletButton}
          onPressQRCodeButton={this.onPressQRCodeButton}
        />
        <SettingsScreenStatisticsPanel
          isCivicLiker={isCivicLiker}
          onPressGetRewardsButton={this.onPressGetRewardsButton}
          onPressRewardedSection={this.onPressStatisticsRewardedSection}
          onPressSupportedSection={this.onPressStatisticsSupportedSection}
        />
        <View style={SETTINGS_MENU.TABLE}>
          <Button
            preset="plain"
            tx="settingsScreen.followSettings"
            textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
            style={SETTINGS_MENU.TABLE_CELL_FIRST_CHILD}
            onPress={this.onPressFollowSettings}
          />
          {this.props.rootStore.getConfig("APP_REFERRAL_ENABLE") === "true" &&
            <Button
              preset="plain"
              tx="settingsScreen.Referral"
              textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
              style={SETTINGS_MENU.TABLE_CELL}
              onPress={this.onPressReferral}
            />
          }
        </View>
        {isIAPEnabled &&
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
            tx="settingsScreen.authcoreSettings"
            textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
            style={SETTINGS_MENU.TABLE_CELL_FIRST_CHILD}
            onPress={this.onPressAuthcoreSettings}
          />
          <Button
            preset="plain"
            tx="settingsScreen.WebsiteSignIn"
            textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
            style={SETTINGS_MENU.TABLE_CELL}
            onPress={this.onPressWebsiteSignIn}
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
