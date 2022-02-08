import * as React from "react"
import { inject } from "mobx-react"
import { NavigationTabScreenProps } from "react-navigation-tabs"
import styled from "styled-components/native"

import { ExtendedView as ExtendedViewBase } from "../../components/extended-view"
import { Screen as ScreenBase } from "../../components/screen"
import { ScrollView as ScrollViewBase } from "../../components/scroll-view"
import { TableView } from "../../components/table-view/table-view"
import { TableViewCell } from "../../components/table-view/table-view-cell"

import { UserStore } from "../../models/user-store"

import { color } from "../../theme"

import { logAnalyticsEvent } from "../../utils/analytics"

import { DashboardStatisticsTableView as DashboardStatisticsTableViewBase } from "./dashboard-statistics-table-view"
import { DashboardUserInfoPanel } from "./dashboard-user-info-panel"
import { DashboardWalletPanel } from "./dashboard-wallet-panel"

const Screen = styled(ScreenBase)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`

const Body = styled.View`
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  padding-top: 0;
`

const ScrollView = styled(ScrollViewBase)`
  background-color: ${({ theme }) => theme.color.background.secondary};
`

const ExtendedView = styled(ExtendedViewBase)`
  margin-bottom: -${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
`

const DashboardStatisticsTableView = styled(DashboardStatisticsTableViewBase)`
  margin-top: ${({ theme }) => theme.spacing.lg};
`

const SubscriptionTableView = styled(TableView)`
  margin-top: ${({ theme }) => theme.spacing.lg};
`

export interface DashboardScreenProps extends NavigationTabScreenProps<{}> {
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
        <DashboardUserInfoPanel onPress={this.onPressUserInfoPanel} />
      </ExtendedView>
    )
  }

  renderBody() {
    const {
      currentUser: { isCivicLiker = false } = {},
      iapStore: { isEnabled: isIAPEnabled },
    } = this.props.userStore
    return (
      <Body>
        <TableView>
          <DashboardWalletPanel
            onPress={this.onPressWalletButton}
            onPressQRCodeButton={this.onPressQRCodeButton}
          />
        </TableView>
        <DashboardStatisticsTableView
          isCivicLiker={isCivicLiker}
          onPressGetRewardsButton={this.onPressGetRewardsButton}
          onPressRewardedSection={this.onPressStatisticsRewardedSection}
          onPressSupportedSection={this.onPressStatisticsSupportedSection}
        />
        {(isIAPEnabled) && (
          <SubscriptionTableView>
            <TableViewCell
              titleTx="settingsScreen.subscription"
              onPress={this.onPressSubscription}
            />
          </SubscriptionTableView>
        )}
      </Body>
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
