import * as React from "react"
import { observer, inject } from "mobx-react"
import {
  StyleSheet,
  TextStyle,
  TouchableHighlight,
  View,
  ViewStyle,
} from "react-native"
import { NavigationScreenProps } from "react-navigation"

import {
  SettingScreenStyle as Style,
  SettingScreenUserInfoStyle as UserInfoStyle,
  SettingsScreenStatsPanelStyle as StatsPanelStyle,
} from "./settings-screen.style"

import { AppVersionLabel } from "../../components/app-version-label"
import { Avatar } from "../../components/avatar"
import { Button } from "../../components/button"
import { ExtendedView } from "../../components/extended-view"
import { Icon } from "../../components/icon"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"

import { color, spacing } from "../../theme"

import { ChainStore } from "../../models/chain-store"
import { UserStore } from "../../models/user-store"
import { ReaderStore } from "../../models/reader-store"
import {
  StatisticsRewardedStore,
  StatisticsSupportedStore,
} from "../../models/statistics-store"

import { logAnalyticsEvent } from "../../utils/analytics"

import * as Intercom from "../../utils/intercom"
import { SettingsScreenWalletActionsView } from "./settings-screen.wallet-actions-view"
import { translate } from "../../i18n"

const LOGOUT: ViewStyle = {
  marginTop: spacing[4],
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}
const VERSION: TextStyle = {
  marginTop: spacing[4]
}
const TABLE_CELL_BASE: ViewStyle = {
  justifyContent: "flex-start",
}
const TABLE_CELL: ViewStyle = {
  ...TABLE_CELL_BASE,
  borderStyle: "solid",
  borderTopColor: color.palette.lighterGrey,
  borderTopWidth: StyleSheet.hairlineWidth,
}
const TABLE_BORDER_RADIUS = 12
const SETTINGS_MENU = StyleSheet.create({
  TABLE: {
    borderRadius: TABLE_BORDER_RADIUS,
    backgroundColor: color.palette.white,
    marginVertical: spacing[4],
  } as ViewStyle,
  TABLE_CELL,
  TABLE_CELL_FIRST_CHILD: {
    ...TABLE_CELL_BASE,
    borderTopLeftRadius: TABLE_BORDER_RADIUS,
    borderTopRightRadius: TABLE_BORDER_RADIUS,
  } as ViewStyle,
  TABLE_CELL_LAST_CHILD: {
    ...TABLE_CELL,
    borderBottomLeftRadius: TABLE_BORDER_RADIUS,
    borderBottomRightRadius: TABLE_BORDER_RADIUS,
  } as ViewStyle,
  TABLE_CELL_TEXT: {
    padding: spacing[2],
    paddingVertical: spacing[1],
    color: color.palette.grey4a,
    textAlign: "left",
    fontWeight: "normal",
  } as TextStyle,
})

export interface SettingsScreenProps extends NavigationScreenProps<{}> {
  chain: ChainStore
  userStore: UserStore
  readerStore: ReaderStore
  rewardedStatistics: StatisticsRewardedStore
  supportedStatistics: StatisticsSupportedStore
}

@inject((allStores: any) => ({
  chain: allStores.chainStore as ChainStore,
  userStore: allStores.userStore as UserStore,
  readerStore: allStores.readerStore as ReaderStore,
  rewardedStatistics:
    allStores.statisticsRewardedStore as StatisticsRewardedStore,
  supportedStatistics:
    allStores.statisticsSupportedStore as StatisticsSupportedStore,
}))
@observer
export class SettingsScreen extends React.Component<SettingsScreenProps, {}> {
  componentDidMount() {
    this.props.chain.fetchAll()
    this.props.supportedStatistics.fetchLatest()
    this.props.rewardedStatistics.fetchSummary()
  }

  private onPressSubscription = () => {
    this.props.navigation.navigate("Subscription")
  }

  private onPressAuthcoreSettings = () => {
    this.props.userStore.authCore.openSettingsWidget({
      company: "Liker ID",
      logo: "https://like.co/favicon.png",
      primaryColour: color.primary,
      successColour: color.primary,
      dangerColour: color.palette.angry,
    })
  }

  private onClickLogout = async () => {
    this.props.readerStore.clearAllLists()
    this.props.userStore.logout()
    this.props.navigation.navigate("Auth")
    logAnalyticsEvent('SignOut')
  }

  private onPressContactUs = () => {
    Intercom.displayMessageComposer()
  }

  private onPressFollowSettings = () => {
    logAnalyticsEvent('SettingsClickFollowSettings')
    this.props.navigation.navigate("FollowSettings")
  }

  private onPressQRCodeButton = () => {
    logAnalyticsEvent('SettingsClickQRCodeScan')
    this.props.navigation.navigate("QRCodeScan")
  }

  private onPressWalletButton = () => {
    logAnalyticsEvent('SettingsClickWallet')
    this.props.navigation.navigate("Wallet")
  }

  private onPressStatsSupportedButton = () => {
    logAnalyticsEvent('SettingsClickStatsSupported')
    this.props.navigation.navigate("StatisticsSupported")
  }

  private onPressStatsRewardsButton = () => {
    logAnalyticsEvent('SettingsClickStatsRewarded')
    this.props.navigation.navigate("StatisticsRewarded")
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
        {this.renderUserInfo()}
        <SettingsScreenWalletActionsView
          walletButtonText={this.props.chain.formattedConciseTotalBalance}
          onPressWalletButton={this.onPressWalletButton}
          onPressQRCodeButton={this.onPressQRCodeButton}
        />
      </ExtendedView>
    )
  }

  renderUserInfo() {
    const { currentUser: user } = this.props.userStore
    if (!user) return null
    return (
      <View style={UserInfoStyle.Root}>
        <Avatar
          src={user.avatarURL}
          isCivicLiker={user.isCivicLiker}
        />
        <View style={UserInfoStyle.Identity}>
          <Text
            style={UserInfoStyle.UserID}
            text={`ID: ${user.likerID}`}
          />
          <Text
            style={UserInfoStyle.DisplayName}
            text={user.displayName}
            numberOfLines={2}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
          />
        </View>
      </View>
    )
  }

  renderBody() {
    const {
      isEnabled: isIAPEnabled
    } = this.props.userStore.iapStore
    return (
      <View style={Style.Body}>
        {this.renderStatsPanel()}
        <View style={SETTINGS_MENU.TABLE}>
          <Button
            preset="plain"
            tx="settingsScreen.followSettings"
            textStyle={SETTINGS_MENU.TABLE_CELL_TEXT}
            style={SETTINGS_MENU.TABLE_CELL_FIRST_CHILD}
            onPress={this.onPressFollowSettings}
          />
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

  renderStatsPanel() {
    const {
      likeAmount: supportedLikeAmount = 0,
      worksCount: supportedWorksCount = 0
    } = this.props.supportedStatistics.weekList[0] || {}
    // TODO: Port real data
    const {
      totalLikeAmount: totalRewardedLikeAmount = 0,
    } = this.props.rewardedStatistics
    return (
      <View style={StatsPanelStyle.Root}>
        <Text
          tx="Statistics.Period.Week.This"
          style={StatsPanelStyle.Label}
        />
        <View style={[SETTINGS_MENU.TABLE, StatsPanelStyle.Table]}>
          <TouchableHighlight
            underlayColor={StatsPanelStyle.ButtonUnderlaying.backgroundColor}
            style={SETTINGS_MENU.TABLE_CELL_FIRST_CHILD}
            onPress={this.onPressStatsSupportedButton}
          >
            <View style={StatsPanelStyle.Button}>
              <View style={StatsPanelStyle.ButtonContent}>
                <Text
                  tx="settingsScreen.StatisticsPanel.Supported.Title"
                  style={StatsPanelStyle.ButtonTitle}
                />
                <View style={StatsPanelStyle.ButtonStatsDetails}>
                  <View style={StatsPanelStyle.ButtonStatsDetailsLeft}>
                    <Text
                      text={`${supportedLikeAmount.toFixed(4)} LIKE`}
                      style={StatsPanelStyle.ButtonStatsDetailsTitle}
                    />
                  </View>
                  <View style={StatsPanelStyle.ButtonStatsDetailsRight}>
                    <Text
                      text={`${supportedWorksCount}`}
                      style={StatsPanelStyle.ButtonStatsDetailsTitle}
                    />
                    <Text
                      text={translate("Statistics.Work", { count: supportedWorksCount })}
                      style={StatsPanelStyle.ButtonStatsDetailsSubtitle}
                    />
                  </View>
                </View>
              </View>
              <Icon name="arrow-right" color="grey9b" />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={StatsPanelStyle.ButtonUnderlaying.backgroundColor}
            style={SETTINGS_MENU.TABLE_CELL_LAST_CHILD}
            onPress={this.onPressStatsRewardsButton}
          >
            <View style={StatsPanelStyle.Button}>
              <View style={StatsPanelStyle.ButtonContent}>
                <Text
                  tx="settingsScreen.StatisticsPanel.Rewarded.Title"
                  style={StatsPanelStyle.ButtonTitle}
                />
                <View style={StatsPanelStyle.ButtonStatsDetails}>
                  <View style={StatsPanelStyle.ButtonStatsDetailsLeft}>
                    <Text
                      text={`${totalRewardedLikeAmount.toFixed(4)} LIKE`}
                      style={StatsPanelStyle.ButtonStatsDetailsTitle}
                    />
                  </View>
                </View>
              </View>
              <Icon name="arrow-right" color="grey9b" />
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}
