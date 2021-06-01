import * as React from "react"
import { inject } from "mobx-react"
import { View } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import styled from "styled-components/native"

import { SettingScreenStyle as Style } from "../settings-screen/settings-screen.style"

import { SettingsScreenStatisticsPanel } from "../settings-screen/settings-screen-statistics-panel"
import { SettingsScreenUserInfoPanel } from "../settings-screen/settings-screen-user-info-panel"
import { SettingsScreenWalletPanel } from "../settings-screen/settings-screen-wallet-panel"

import { ExtendedView as ExtendedViewBase } from "../../components/extended-view"
import { Screen as ScreenBase } from "../../components/screen"
import { ScrollView as ScrollViewBase } from "../../components/scroll-view"
import { SponsorLinkCTATableView as SponsorLinkCTATableViewBase } from "../../components/sponsor-link-cta-table-view"
import { TableView } from "../../components/table-view/table-view"
import { TableViewCell } from "../../components/table-view/table-view-cell"

import { UserStore } from "../../models/user-store"

import { color } from "../../theme"

import { logAnalyticsEvent } from "../../utils/analytics"

const Screen = styled(ScreenBase)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`

const ScrollView = styled(ScrollViewBase)`
  background-color: ${({ theme }) => theme.color.background.secondary};
`

const ExtendedView = styled(ExtendedViewBase)`
  margin-bottom: -${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
`

const SponsorLinkCTATableView = styled(SponsorLinkCTATableViewBase)`
  margin-top: ${({ theme }) => theme.spacing["2xl"]};
`

export interface DashboardScreenProps extends NavigationScreenProps<{}> {
  userStore: UserStore
}

@inject("userStore")
export class DashboardScreen extends React.Component<DashboardScreenProps, {}> {
  private onPressUserInfoPanel = () => {
    this.props.navigation.navigate("FansDashboard")
  }

  private onPressSubscription = () => {
    this.props.navigation.navigate("Subscription")
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

  renderHeader() {
    return (
      <ExtendedView backgroundColor={color.primary}>
        <SettingsScreenUserInfoPanel onPress={this.onPressUserInfoPanel} />
      </ExtendedView>
    )
  }

  renderBody() {
    const {
      currentUser: { likerID = "", isCivicLiker = false } = {},
      iapStore: { isEnabled: isIAPEnabled },
    } = this.props.userStore
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
        {(isIAPEnabled) && (
          <TableView>
            <TableViewCell
              titleTx="settingsScreen.subscription"
              onPress={this.onPressSubscription}
            />
          </TableView>
        )}
        <SponsorLinkCTATableView
          likerID={likerID}
          utmSource="dashboard"
        />
      </View>
    )
  }

  render() {
    return (
      <Screen preset="fixed">
        <ScrollView isWithShadow={true}>
          {this.renderHeader()}
          {this.renderBody()}
        </ScrollView>
      </Screen>
    )
  }
}
