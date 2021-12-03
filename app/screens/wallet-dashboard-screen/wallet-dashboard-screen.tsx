import * as React from "react"
import {
  View,
  RefreshControl,
} from "react-native"
import { StackActions } from "react-navigation"
import { observer, inject } from "mobx-react"
import styled from "styled-components/native"

import {
  WalletDashboardScreenProps as Props,
} from "./wallet-dashboard-screen.props"
import {
  WalletDashboardScreenStyle as Style,
} from "./wallet-dashboard-screen.style"
import {
  ValidatorScreenGridItem,
} from "../validator-screen/validator-screen.grid-item"

import { Button } from "../../components/button"
import { ButtonGroup } from "../../components/button-group"
import { UnderlayView } from "../../components/extended-view"
import { Screen as ScreenBase } from "../../components/screen"
import { ScrollView } from "../../components/scroll-view"
import { Sheet } from "../../components/sheet"
import { Text } from "../../components/text"
import { ValidatorList } from "../../components/validator-list"

import { ChainStore } from "../../models/chain-store"
import { ExperimentalFeatureStore } from "../../models/experimental-feature-store"
import { UserStore } from "../../models/user-store"
import { Validator } from "../../models/validator"

import { color } from "../../theme"

import { logAnalyticsEvent } from "../../utils/analytics"
import { Header } from "../../components/header"

const Screen = styled(ScreenBase)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`

@inject((allStores: any) => ({
  chain: allStores.chainStore as ChainStore,
  userStore: allStores.userStore as UserStore,
  experimentalFeatures: allStores.experimentalFeatureStore as ExperimentalFeatureStore,
}))
@observer
export class WalletDashboardScreen extends React.Component<Props> {
  private onPressCloseButton = () => {
    logAnalyticsEvent('WalletClickClose')
    this.props.navigation.dispatch(StackActions.popToTop())
  }
  
  private onPressWalletConnectButton = () => {
    logAnalyticsEvent("WalletClickWalletConnect")
    this.props.navigation.navigate("WalletConnectList")
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
      <Screen preset="fixed">
        <ScrollView
          isWithShadow={true}
          refreshControl={
            <RefreshControl
              tintColor={color.palette.lighterCyan}
              colors={[color.primary]}
              refreshing={this.props.chain.isLoading}
              onRefresh={this.props.chain.fetchAll}
            />
          }
        >
          <View>
            <Header
              leftIcon="close"
              leftIconColor="white"
              onLeftPress={this.onPressCloseButton}
              rightIcon={this.props.experimentalFeatures.isWalletConnectEnabled ? "wallet-connect" : undefined}
              rightIconColor="likeCyan"
              onRightPress={this.onPressWalletConnectButton}
            >
              {currentUser &&
                <Text
                  style={Style.UserIDLabel}
                  align="center"
                  text={`Liker ID: ${currentUser.likerID}`}
                />
              }
            </Header>
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
            <View style={Style.DashboardHeader}>
              <View style={Style.DashboardHeaderButtonGroupWrapper}>
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
                      color: "white",
                      icon: "qrcode-scan",
                      style: Style.QRCodeButton,
                      onPress: this.onPressQRCodeButton,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          <View style={Style.DashboardBodyWrapper}>
            <Sheet style={Style.DashboardBody}>
              {this.renderBalanceView()}
              <View style={Style.ValidatorListHeader}>
                <Text
                  tx="walletDashboardScreen.stakeLabel"
                  color="likeGreen"
                  size="default"
                  weight="600"
                  align="center"
                />
                <View style={Style.ValidatorListVerticalLine} />
              </View>
              <ValidatorList
                chain={this.props.chain}
                filter="all"
                limit={10}
                style={Style.ValidatorListWrapper}
                onPressItem={this.onPressValidator}
              />
              <View style={Style.ValidatorListFooter}>
                <Button
                  preset="outlined"
                  tx="walletDashboardScreen.AllValidatorsButtonText"
                  color="likeCyan"
                  onPress={this.onPressAllValidatorsButton}
                />
              </View>
              <View style={Style.DashboardFooter}>
                <Button
                  preset="outlined"
                  tx="common.viewOnBlockExplorer"
                  color="likeCyan"
                  link={this.props.chain.wallet.blockExplorerURL}
                />
              </View>
            </Sheet>
          </View>
          <UnderlayView />
        </ScrollView>
      </Screen>
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
      <View style={Style.BalanceView}>
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
          <View style={Style.WithdrawRewardsButtonWrapper}>
            <Button
              preset="primary"
              tx="walletDashboardScreen.withdrawRewardsButtonText"
              style={Style.WithdrawRewardsButton}
              onPress={this.onPressRewardsWithdrawButton}
            />
          </View>
        }
      </View>
    )
  }
}
