import * as React from "react"
import { inject } from "mobx-react"
import { View } from "react-native"
import { NavigationScreenProps } from "react-navigation"

import {
  SETTINGS_MENU,
  SettingScreenStyle as Style,
} from "../settings-screen/settings-screen.style"

import { SettingsScreenStatisticsPanel } from "../settings-screen/settings-screen-statistics-panel"
import { SettingsScreenUserInfoPanel } from "../settings-screen/settings-screen-user-info-panel"
import { SettingsScreenWalletPanel } from "../settings-screen/settings-screen-wallet-panel"

import { Button } from "../../components/button"
import { ExtendedView } from "../../components/extended-view"
import { Screen } from "../../components/screen"

import { UserStore } from "../../models/user-store"

import { color } from "../../theme"

import { logAnalyticsEvent } from "../../utils/analytics"

export interface DashboardScreenProps extends NavigationScreenProps<{}> {
  userStore: UserStore
}

@inject("userStore")
export class DashboardScreen extends React.Component<DashboardScreenProps, {}> {
  private onPressSubscription = () => {
    this.props.navigation.navigate("Subscription")
  }

  private onPressReferral = () => {
    this.props.navigation.navigate("Referral")
    logAnalyticsEvent("SettingsClickReferral")
  }

  private onPressQRCodeButton = () => {
    this.props.navigation.navigate("QRCodeScan")
    logAnalyticsEvent("SettingsClickQRCodeScan")
  }

  private onPressWalletButton = () => {
    this.props.navigation.navigate("Wallet")
    logAnalyticsEvent("SettingsClickWallet")
  }

  private onPressStatisticsSupportedSection = () => {
    this.props.navigation.navigate("StatisticsSupported")
    logAnalyticsEvent("SettingsClickStatsSupported")
  }

  private onPressStatisticsRewardedSection = () => {
    this.props.navigation.navigate("StatisticsRewarded")
    logAnalyticsEvent("SettingsClickStatsRewarded")
  }

  private onPressGetRewardsButton = () => {
    this.props.navigation.navigate("Referral")
  }

  render() {
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
      <ExtendedView backgroundColor={color.primary} style={Style.Header}>
        <SettingsScreenUserInfoPanel />
      </ExtendedView>
    )
  }

  renderBody() {
    const {
      currentUser: { isCivicLiker },
      iapStore: { isEnabled: isIAPEnabled },
    } = this.props.userStore
    const isShowReferral =
      this.props.userStore.getConfig("APP_REFERRAL_ENABLE") === "true"
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
        {(isShowReferral || isIAPEnabled) && (
          <View style={SETTINGS_MENU.TABLE}>
            {isIAPEnabled && (
              <Button
                preset="plain"
                tx="settingsScreen.subscription"
                textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
                style={SETTINGS_MENU.TABLE_CELL_FIRST_CHILD}
                onPress={this.onPressSubscription}
              />
            )}
            {isShowReferral && (
              <Button
                preset="plain"
                tx="settingsScreen.Referral"
                textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
                style={SETTINGS_MENU.TABLE_CELL}
                onPress={this.onPressReferral}
              />
            )}
          </View>
        )}
      </View>
    )
  }
}
