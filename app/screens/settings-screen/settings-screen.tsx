import * as React from "react"
import { observer, inject } from "mobx-react"
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
  SettingScreenUserInfoStyle as UserInfoStyle,
} from "./settings-screen.style"

import {
  SettingsScreenStatisticsPanel,
} from "./settings-screen-statistics-panel"
import {
  SettingsScreenWalletActionsView,
} from "./settings-screen.wallet-actions-view"

import { AppVersionLabel } from "../../components/app-version-label"
import { Avatar } from "../../components/avatar"
import { Button } from "../../components/button"
import { ExtendedView } from "../../components/extended-view"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"

import { ChainStore } from "../../models/chain-store"
import { UserStore } from "../../models/user-store"
import { ReaderStore } from "../../models/reader-store"

import { color } from "../../theme"

import { logAnalyticsEvent } from "../../utils/analytics"

export interface SettingsScreenProps extends NavigationScreenProps<{}> {
  chain: ChainStore
  userStore: UserStore
  readerStore: ReaderStore
}

@inject((allStores: any) => ({
  chain: allStores.chainStore as ChainStore,
  userStore: allStores.userStore as UserStore,
  readerStore: allStores.readerStore as ReaderStore,
}))
@observer
export class SettingsScreen extends React.Component<SettingsScreenProps, {}> {
  componentDidMount() {
    this.props.chain.fetchAll()
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
    this.props.navigation.navigate("CrispSupport")
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
      currentUser: {
        isCivicLiker,
      },
      iapStore: {
        isEnabled: isIAPEnabled
      },
    } = this.props.userStore
    return (
      <View style={Style.Body}>
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
}
