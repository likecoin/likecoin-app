import * as React from "react"
import { NavigationScreenProps } from "react-navigation"
import {
  StyleSheet,
  View,
  ViewStyle,
  RefreshControl,
} from "react-native"
import { observer, inject } from "mobx-react"

import { WalletDashboardScreenStyle as Style } from "./wallet-dashboard-screen.style"
import { ValidatorScreenGridItem } from "../validator-screen/validator-screen.grid-item"

import { Button } from "../../components/button"
import { ButtonGroup } from "../../components/button-group"
import { Screen } from "../../components/screen"
import { Sheet } from "../../components/sheet"
import { Text } from "../../components/text"
import { ValidatorList } from "../../components/validator-list"
import { color, spacing } from "../../theme"

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
  padding: spacing[3],
  paddingBottom: 64,
}
const DASHBOARD_HEADER_BUTTON_GROUP_WRAPPER: ViewStyle = {
  alignItems: "center",
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
const BALANCE_VIEW: ViewStyle = {
  paddingTop: spacing[4],
  paddingHorizontal: spacing[6],
  paddingBottom: spacing[6],
}
const VALIDATOR_LIST = StyleSheet.create({
  CONTAINER: {
    padding: spacing[2],
  } as ViewStyle,
  Footer: {
    paddingTop: spacing[2],
    paddingHorizontal: spacing[4],
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
  private onPressCloseButton = () => {
    logAnalyticsEvent('WalletClickClose')
    this.props.navigation.popToTop()
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

  private onPressAllValidatorsButton = () => {
    logAnalyticsEvent("WalletClickValidatorList")
    this.props.navigation.navigate("ValidatorList")
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
              onRefresh={this.props.chain.fetchAll}
            />
          }
        >
          <View style={Style.TopNavigation}>
            <Button
              preset="icon"
              icon="close"
              color="white"
              onPress={this.onPressCloseButton}
            />
            {currentUser &&
              <Text
                style={Style.UserIDLabel}
                align="center"
                text={`ID: ${currentUser.likerID}`}
              />
            }
          </View>
          <View style={Style.BalanceContainer}>
            {this.renderBalanceValue()}
            <Text
              text={this.props.chain.denom}
              color="white"
              size="medium"
              weight="600"
              align="center"
              style={Style.BalanceUnitLabel}
            />
          </View>
          <View style={DASHBOARD_HEADER}>
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
                isShort
                style={VALIDATOR_LIST.CONTAINER}
                onPressItem={this.onPressValidator}
              />
              <View style={VALIDATOR_LIST.Footer}>
                <Button
                  preset="outlined"
                  tx="walletDashboardScreen.AllValidatorsButtonText"
                  color="likeCyan"
                  onPress={this.onPressAllValidatorsButton}
                />
              </View>
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
        style={Style.BalanceValueText}
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
