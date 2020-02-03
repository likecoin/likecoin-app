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
  SettingScreenHeaderStyle as HeaderStyle,
  SettingScreenUserInfoStyle as UserInfoStyle,
} from "./settings-screen.style"

import { AppVersionLabel } from "../../components/app-version-label"
import { Avatar } from "../../components/avatar"
import { Button } from "../../components/button"
import { ButtonGroup } from "../../components/button-group"
import { Icon } from "../../components/icon"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"

import { color, spacing } from "../../theme"

import { ChainStore } from "../../models/chain-store"
import { UserStore } from "../../models/user-store"
import { ReaderStore } from "../../models/reader-store"
import { RootStore } from "../../models/root-store"

import { logAnalyticsEvent } from "../../utils/analytics"

import * as Intercom from "../../utils/intercom"

const CONTENT_VIEW: ViewStyle = {
  padding: spacing[4],
}
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
    const {
      currentUser,
      iapStore: {
        isEnabled: isEnabledIAP
      },
    } = this.props.userStore
    return (
      <Screen
        preset="fixed"
        backgroundColor={color.primary}
      >
        {this.renderHeader()}
        {!!currentUser &&
          <Screen
            style={CONTENT_VIEW}
            preset="scroll"
            backgroundColor="#F2F2F2"
            unsafe
          >
            {isEnabledIAP &&
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
          </Screen>
        }
      </Screen>
    )
  }

  renderHeader() {
    return (
      <View style={HeaderStyle.Root}>
        {this.renderUserInfo()}
        <View style={HeaderStyle.ButtonsContainer}>
          <ButtonGroup
            buttons={[
              {
                key: "scan",
                preset: "icon",
                icon: "qrcode-scan",
                style: HeaderStyle.QRCodeButton,
                onPress: this.onPressQRCodeButton,
              },
            ]}
            style={HeaderStyle.QRCodeButtonGroup}
          />
          <Button
            preset="gradient"
            text={this.props.chain.formattedConciseTotalBalance}
            prepend={(
              <Icon
                name="tab-wallet"
                fill={color.primary}
                width={20}
                style={HeaderStyle.WalletButtonIcon}
              />
            )}
            textStyle={HeaderStyle.WalletButtonTextStyle}
            style={HeaderStyle.WalletButton}
            onPress={this.onPressWalletButton}
          />
        </View>
      </View>
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
          />
        </View>
      </View>
    )
  }
}
