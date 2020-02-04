import * as React from "react"
import { observer, inject } from "mobx-react"
import {
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { NavigationScreenProps } from "react-navigation"

import {
  SettingScreenStyle as Style,
  SettingScreenUserInfoStyle as UserInfoStyle,
} from "./settings-screen.style"

import { AppVersionLabel } from "../../components/app-version-label"
import { Avatar } from "../../components/avatar"
import { Button } from "../../components/button"
import { ExtendedView } from "../../components/extended-view"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"

import { color, spacing } from "../../theme"

import { ChainStore } from "../../models/chain-store"
import { UserStore } from "../../models/user-store"
import { ReaderStore } from "../../models/reader-store"
import { RootStore } from "../../models/root-store"

import { logAnalyticsEvent } from "../../utils/analytics"

import * as Intercom from "../../utils/intercom"
import { SettingsScreenWalletActionsView } from "./settings-screen.wallet-actions-view"

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
const SETTINGS_MENU = StyleSheet.create({
  TABLE: {
    borderRadius: 12,
    backgroundColor: color.palette.white,
    marginVertical: spacing[4],
  } as ViewStyle,
  TABLE_CELL: {
    ...TABLE_CELL_BASE,
    borderStyle: "solid",
    borderTopColor: color.palette.lighterGrey,
    borderTopWidth: StyleSheet.hairlineWidth,
  } as ViewStyle,
  TABLE_CELL_FIRST_CHILD: TABLE_CELL_BASE,
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
  userStore: UserStore,
  readerStore: ReaderStore,
}

@inject((rootStore: RootStore) => ({
  chain: rootStore.chainStore,
  userStore: rootStore.userStore,
  readerStore: rootStore.readerStore,
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
    this.props.navigation.navigate("AuthcoreSettings")
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

  private onPressQRCodeButton = () => {
    logAnalyticsEvent('SettingsClickQRCodeScan')
    this.props.navigation.navigate("QRCodeScan")
  }

  private onPressWalletButton = () => {
    logAnalyticsEvent('SettingsClickWallet')
    this.props.navigation.navigate("Wallet")
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
