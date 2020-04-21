import * as React from "react"
import { observer, inject } from "mobx-react"
import {
  Linking,
  TouchableHighlight,
  View,
} from "react-native"
import { NavigationScreenProps } from "react-navigation"

import {
  LOGOUT,
  VERSION,
  SETTINGS_MENU,
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

import { color, gradient } from "../../theme"

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
import LinearGradient from "react-native-linear-gradient"

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
    this.props.supportedStatistics.fetchTopSupportedCreators()
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

  private onPressGetRewardsButton = () => {
    Linking.openURL("https://like.co/in/creator")
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
    const [topSupportedCreator] =
      this.props.supportedStatistics.topSupportedCreators
    const {
      displayName = "",
      isCivicLiker = false,
      avatarURL = "",
    } = topSupportedCreator || {}
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
          {!!topSupportedCreator && (
            <TouchableHighlight
              underlayColor={StatsPanelStyle.ButtonUnderlaying.backgroundColor}
              style={SETTINGS_MENU.TABLE_CELL_FIRST_CHILD}
            >
              <LinearGradient
                colors={gradient.LikeCoin}
                start={{ x: 0.0, y: 1.0 }}
                end={{ x: 1.0, y: 0.0 }}
                style={StatsPanelStyle.Button}
              >
                <View style={StatsPanelStyle.ButtonContent}>
                  <View style={StatsPanelStyle.TopSupportedCreatorIdentity}>
                    <Avatar
                      src={avatarURL}
                      size={40}
                      isCivicLiker={isCivicLiker}
                      style={StatsPanelStyle.TopSupportedCreatorAvatar}
                    />
                    <Text
                      text={displayName}
                      color="grey4a"
                      size="medium-large"
                    />
                  </View>
                  <Text
                    text={translate("settingsScreen.StatisticsPanel.TopSupportedCreator.SupportMore", {
                      creator: displayName
                    })}
                    color="grey4a"
                    size="medium-large"
                    weight="500"
                    style={StatsPanelStyle.ButtonTitle}
                  />
                  <Text
                    tx="settingsScreen.StatisticsPanel.TopSupportedCreator.BecomeCivicLiker"
                    color="likeGreen"
                    size="default"
                    weight="500"
                  />
                </View>
                <Icon name="arrow-right" color="likeGreen" />
              </LinearGradient>
            </TouchableHighlight>
          )}
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
                      text={(
                        totalRewardedLikeAmount > 0
                          ? `${totalRewardedLikeAmount.toFixed(4)} LIKE`
                          : "---"
                      )}
                      style={StatsPanelStyle.ButtonStatsDetailsTitle}
                    />
                  </View>
                </View>
              </View>
              {totalRewardedLikeAmount === 0 && (
                <Button
                  preset="plain"
                  tx="settingsScreen.StatisticsPanel.Rewarded.GetRewardsButtonTitle"
                  color="likeCyan"
                  weight="500"
                  onPress={this.onPressGetRewardsButton}
                />
              )}
              <Icon name="arrow-right" color="grey9b" />
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}
