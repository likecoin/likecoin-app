import * as React from "react"
import { NavigationScreenProps } from "react-navigation"
import {
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  RefreshControl,
} from "react-native"
import LinearGradient from 'react-native-linear-gradient'
import { observer, inject } from "mobx-react"

import { ValidatorScreenGridItem } from "../validator-screen/validator-screen.grid-item"

import { Avatar } from "../../components/avatar"
import { Button } from "../../components/button"
import { ButtonGroup } from "../../components/button-group"
import { Screen } from "../../components/screen"
import { Sheet } from "../../components/sheet"
import { Text } from "../../components/text"
import { ValidatorList } from "../../components/validator-list"
import { color, gradient, spacing } from "../../theme"

import { ChainStore } from "../../models/chain-store"
import { UserStore } from "../../models/user-store"
import { Validator } from "../../models/validator"

import { logAnalyticsEvent } from "../../utils/analytics"

export interface WalletDashboardScreenProps extends NavigationScreenProps<{}> {
  chain: ChainStore
  userStore: UserStore
}

const ROOT: ViewStyle = {
  flex: 1,
  backgroundColor: color.palette.white,
}
const TOP_UNDERLAY: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  aspectRatio: 0.8,
  backgroundColor: color.primary,
}
const SCREEN: ViewStyle = {
  flexGrow: 1,
  alignItems: "stretch",
}
const DASHBOARD_HEADER: ViewStyle = {
  padding: 24,
  paddingBottom: 64,
}
const USER_INFO_ROOT: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}
const USER_INFO_IDENTITY: ViewStyle = {
  marginLeft: 12,
}
const USER_INFO_USER_ID: TextStyle = {
  color: color.palette.white,
  opacity: 0.6,
  fontSize: 12,
}
const USER_INFO_DISPLAY_NAME: TextStyle = {
  color: color.palette.white,
  fontSize: 28,
  fontWeight: "500",
}
const DASHBOARD_HEADER_BUTTON_GROUP_WRAPPER: ViewStyle = {
  alignItems: "center",
  marginTop: spacing[4],
}
const DASHBOARD_BODY: ViewStyle = {
  flexGrow: 1,
  backgroundColor: color.palette.white,
  paddingHorizontal: spacing[3],
  paddingBottom: spacing[6],
}
const DASHBOARD_BODY_INNER: ViewStyle = {
  flex: 1,
  marginTop: -40,
}
const DASHBOARD_FOOTER: ViewStyle = {
  marginTop: spacing[5],
  paddingTop: spacing[6],
  margin: spacing[5],
  borderTopColor: color.palette.grey9b,
  borderTopWidth: StyleSheet.hairlineWidth,
}
const QRCODE_BUTTON: ViewStyle = {
  paddingHorizontal: spacing[3],
}
const WALLET_BALANCE = StyleSheet.create({
  AMOUNT: {
    paddingHorizontal: spacing[4],
    color: color.primary,
    fontSize: 36,
    fontWeight: "500",
    textAlign: "center",
  } as TextStyle,
  ROOT: {
    padding: spacing[3],
  },
  UNIT: {
    marginTop: spacing[2],
  } as TextStyle,
})
const BALANCE_VIEW: ViewStyle = {
  paddingTop: spacing[4],
  paddingHorizontal: spacing[6],
  paddingBottom: spacing[6],
}
const VALIDATOR_LIST = StyleSheet.create({
  CONTAINER: {
    padding: spacing[2],
  } as ViewStyle,
  HEADER: {
    alignItems: "center",
  } as ViewStyle,
  VERTICAL_LINE: {
    width: 2,
    height: 16,
    marginTop: spacing[2],
    backgroundColor: color.primary,
  } as ViewStyle,
})
const WITHDRAW_REWARDS_BUTTON = StyleSheet.create({
  INNER: {
    paddingHorizontal: spacing[4],
  },
  WRAPPER: {
    alignItems: "center"
  } as ViewStyle,
})

@inject((store: any) => ({
  chain: store.chainStore as ChainStore,
  userStore: store.userStore as UserStore,
}))
@observer
export class WalletDashboardScreen extends React.Component<WalletDashboardScreenProps, {}> {
  componentDidMount() {
    this.fetchAll()
  }

  private fetchAll = async () => {
    this.props.chain.fetchBalance()
    await this.props.chain.fetchAnnualProvision()
    await this.props.chain.fetchValidators()
    this.props.chain.fetchDelegations()
    this.props.chain.fetchRedelegations()
    this.props.chain.fetchUnbondingDelegations()
    this.props.chain.fetchRewards()
  }

  private onPressSendButton = () => {
    logAnalyticsEvent('WalletClickTransfer')
    this.props.navigation.navigate("Transfer")
  }

  private onPressReceiveButton = () => {
    logAnalyticsEvent('WalletClickReceive')
    this.props.navigation.navigate("Receive")
  }

  private onPressQRCodeButton = () => {
    logAnalyticsEvent('WalletClickQRCodeScan')
    this.props.navigation.navigate("QRCodeScan")
  }

  private onPressRewardsWithdrawButton = () => {
    logAnalyticsEvent('WalletClickStakingRewardsWithdraw')
    this.props.navigation.navigate("StakingRewardsWithdraw")
  }

  private onPressValidator = (validator: Validator) => {
    logAnalyticsEvent('WalletClickValidator', { validator: validator.moniker })
    this.props.navigation.navigate("Validator", {
      validator,
    })
  }

  render () {
    const { currentUser } = this.props.userStore
    return (
      <View style={ROOT}>
        <View style={TOP_UNDERLAY} />
        <Screen
          style={SCREEN}
          backgroundColor={color.transparent}
          preset="scroll"
          refreshControl={
            <RefreshControl
              tintColor={color.palette.lighterCyan}
              colors={[color.primary]}
              refreshing={this.props.chain.isLoading}
              onRefresh={this.fetchAll}
            />
          }
        >
          <View style={DASHBOARD_HEADER}>
            {currentUser &&
              <View style={USER_INFO_ROOT}>
                <Avatar
                  src={currentUser.avatarURL}
                  isCivicLiker={currentUser.isCivicLiker}
                />
                <View style={USER_INFO_IDENTITY}>
                  <Text
                    style={USER_INFO_USER_ID}
                    text={`ID: ${currentUser.likerID}`}
                  />
                  <Text
                    style={USER_INFO_DISPLAY_NAME}
                    text={currentUser.displayName}
                  />
                </View>
              </View>
            }
            <View style={DASHBOARD_HEADER_BUTTON_GROUP_WRAPPER}>
              <ButtonGroup
                buttons={[
                  {
                    key: "send",
                    tx: "walletDashboardScreen.send",
                    onPress: this.onPressSendButton,
                  },
                  {
                    key: "receive",
                    tx: "walletDashboardScreen.receive",
                    onPress: this.onPressReceiveButton,
                  },
                  {
                    key: "scan",
                    preset: "icon",
                    icon: "qrcode-scan",
                    style: QRCODE_BUTTON,
                    onPress: this.onPressQRCodeButton,
                  },
                ]}
              />
            </View>
          </View>
          <View style={DASHBOARD_BODY}>
            <Sheet style={DASHBOARD_BODY_INNER}>
              <LinearGradient
                colors={gradient.LikeCoin}
                start={{ x: 0.0, y: 1.0 }}
                end={{ x: 1.0, y: 0.0 }}
                style={WALLET_BALANCE.ROOT}
              >
                {this.renderBalanceValue()}
                <Text
                  text={this.props.chain.denom}
                  color="likeGreen"
                  size="medium"
                  weight="600"
                  align="center"
                  style={WALLET_BALANCE.UNIT}
                />
              </LinearGradient>
              {this.renderBalanceView()}
              <View style={VALIDATOR_LIST.HEADER}>
                <Text
                  tx="walletDashboardScreen.stakeLabel"
                  color="likeGreen"
                  size="default"
                  weight="600"
                  align="center"
                />
                <View style={VALIDATOR_LIST.VERTICAL_LINE} />
              </View>
              <ValidatorList
                chain={this.props.chain}
                style={VALIDATOR_LIST.CONTAINER}
                onPressItem={this.onPressValidator}
              />
              <View style={DASHBOARD_FOOTER}>
                <Button
                  preset="outlined"
                  tx="common.viewOnBlockExplorer"
                  color="likeCyan"
                  link={this.props.chain.wallet.blockExplorerURL}
                />
              </View>
            </Sheet>
          </View>
        </Screen>
      </View>
    )
  }

  private renderBalanceValue = () => {
    return (
      <Text
        style={WALLET_BALANCE.AMOUNT}
        text={this.props.chain.formattedTotalBalance}
        numberOfLines={1}
        adjustsFontSizeToFit
      />
    )
  }

  private renderBalanceView = () => {
    const {
      formattedAvailableBalance: available,
      formattedRewardsBalance: rewards,
      formattedUnbondingBalance: unbonding,
    } = this.props.chain
    const {
      hasUnbonding,
      hasRewards,
    } = this.props.chain.wallet
    const rewardsTextColor = hasRewards ? "green" : "grey4a"
    return (
      <View style={BALANCE_VIEW}>
        <ValidatorScreenGridItem
          value={available}
          labelTx="walletDashboardScreen.availableBalanceLabel"
          color="grey4a"
          isPaddingLess
          isShowSeparator={false}
        />
        <ValidatorScreenGridItem
          value={rewards}
          labelTx="walletDashboardScreen.allDelegatorRewardsLabel"
          color={rewardsTextColor}
          isPaddingLess
          isShowSeparator={false}
        />
        {hasUnbonding &&
          <ValidatorScreenGridItem
            value={unbonding}
            labelTx="walletDashboardScreen.allUnbondingBalanceLabel"
            color="greyBlue"
            isPaddingLess
            isShowSeparator={false}
          />
        }
        {hasRewards &&
          <View style={WITHDRAW_REWARDS_BUTTON.WRAPPER}>
            <Button
              preset="primary"
              tx="walletDashboardScreen.withdrawRewardsButtonText"
              style={WITHDRAW_REWARDS_BUTTON.INNER}
              onPress={this.onPressRewardsWithdrawButton}
            />
          </View>
        }
      </View>
    )
  }
}
