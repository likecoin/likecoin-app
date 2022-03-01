import * as React from "react"
import {
  Alert,
  Animated,
  Clipboard,
  Image,
  View,
  TouchableOpacity,
  RefreshControl,
} from "react-native"
import { NavigationStackScreenProps } from "react-navigation-stack"
import { inject, observer } from "mobx-react"
import styled from "styled-components/native"
import BigNumber from "bignumber.js"

import { translate } from "../../i18n"
import { color } from "../../theme"
import { logAnalyticsEvent } from "../../utils/analytics"

import { CivicLikerStakingStore } from "../../models/civic-liker-staking-store"
import { ChainStore } from "../../models/chain-store"
import { RootStore } from "../../models/root-store"
import { Validator } from "../../models/validator"

import { Button } from "../../components/button"
import { textPresets as ButtonTextPresets } from "../../components/button/button.presets"
import { ButtonGroup } from "../../components/button-group"
import { Header, HeaderTitle } from "../../components/header"
import { Icon } from "../../components/icon"
import { Screen as ScreenBase } from "../../components/screen"
import { ScrollView as ScrollViewBase } from "../../components/scroll-view"
import { Text } from "../../components/text"
import CivicLikerV3ControlledSummaryView from "../../components/civic-liker-v3/controlled-summary-view"

import GlobeIcon from "../../assets/globe.svg"

import { StakingDelegationAmountInputScreenParams } from "../staking-delegation-amount-input-screen"

import { ValidatorScreenStyle as Style } from "./validator-screen.style"
import { ValidatorScreenGridItem } from "./validator-screen.grid-item"

const Screen = styled(ScreenBase)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`

const ScrollView = styled(ScrollViewBase)`
  flex: 1;
  padding: 0 ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
`

export interface ValidatorScreenNavigationParams {
  validator: Validator
}
export interface ValidatorScreenProps extends NavigationStackScreenProps<ValidatorScreenNavigationParams> {
  chain: ChainStore,
  civicLikerStakingStore: CivicLikerStakingStore
}

@inject((rootStore: RootStore) => ({
  chain: rootStore.chainStore,
  civicLikerStakingStore: rootStore.civicLikerStakingStore,
}))
@observer
export class ValidatorScreen extends React.Component<ValidatorScreenProps, {}> {
  state = {
    hasCopiedValidatorAddress: false,
    scrollY: new Animated.Value(0),
  }

  componentDidMount(): void {
    if (this.validator.isCivicLiker) {
      this.props.civicLikerStakingStore.fetchStaking()
    }
  }

  private get validator() {
    return this.props.navigation.getParam("validator")
  }

  private onPressValidatorAddress = () => {
    logAnalyticsEvent('ValidatorCopyWalletAddr')
    Clipboard.setString(this.validator.operatorAddress)
    this.setState({ hasCopiedValidatorAddress: true })
  }

  private onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  private handleDelegateButtonPress = () => {
    const params: StakingDelegationAmountInputScreenParams = {
      target: this.validator.operatorAddress
    }
    if (this.validator.isCivicLiker) {
      const { stakingAmountRequired } = this.props.civicLikerStakingStore
      if (stakingAmountRequired > 0) {
        params.suggestedAmount = this.props.chain.fromDenom(new BigNumber(stakingAmountRequired))
      }
    }
    this.props.navigation.navigate("StakingDelegation", params)
  }

  private onPressDelegateButton = () => {
    logAnalyticsEvent('ValidatorClickDelegate')
    this.handleDelegateButtonPress()
  }

  private onPressRedelegateButton = () => {
    logAnalyticsEvent('ValidatorClickRedelegate')
    this.props.navigation.navigate("StakingRedelegation", {
      from: this.validator.operatorAddress,
    })
  }

  private onPressLockedRedelegateButton = () => {
    logAnalyticsEvent("ValidatorClickRedelegateLock")
    Alert.alert(
      translate("validatorScreen.RedelegationLockAlert.title"),
      translate("validatorScreen.RedelegationLockAlert.message"),
      [{ text: translate("common.confirm") }]
    )
  }

  private onPressUndelegateButton = () => {
    logAnalyticsEvent('ValidatorClickUndelegate')
    this.props.navigation.navigate("StakingUnbondingDelegation", {
      target: this.validator.operatorAddress,
    })
  }

  private onRefresh = () => {
    this.validator.fetchInfo()
    this.props.chain.fetchDelegation(this.validator.operatorAddress)
    this.props.chain.fetchRewardsFromValidator(this.validator.operatorAddress)
    this.props.chain.fetchUnbondingDelegation(this.validator.operatorAddress)
  }

  private onPressCivicLikerStakeButton = () => {
    logAnalyticsEvent('ValidatorClickCivicLikerStake')
    this.handleDelegateButtonPress()
  }

  private renderIdentitySection = () => {
    return (
      <ValidatorScreenGridItem
        style={Style.Identity}
        innerStyle={Style.IdentityLayout}
        isShowSeparator={false}
      >
        <Image
          source={{ uri: this.validator.avatar }}
          style={Style.ValidatorIcon}
        />
        <View style={Style.IdentityRight}>
          <Text
            text={this.validator.moniker}
            numberOfLines={3}
            adjustsFontSizeToFit
            ellipsizeMode="middle"
            style={Style.ValidatorName}
          />
          <Text
            tx={`validatorScreen.Status.${
              this.validator.isActive ? "Active" : "Inactive"
            }`}
            style={this.validator.isActive
              ? Style.StatusActive
              : Style.StatusInactive
            }
          />
        </View>
      </ValidatorScreenGridItem>
    )
  }

  private renderDelegationSection = () => {
    const { operatorAddress: validatorAddress } = this.validator
    const { formatDenom, formatRewards } = this.props.chain
    const delegation = this.props.chain.wallet.getDelegation(validatorAddress)
    const delegatorRewardsTextColor = delegation.hasRewards ? "darkModeGreen" : "white"
    const canRedelegate = this.props.chain.wallet.canRedelegateFromValidator(validatorAddress)
    return (
      <ValidatorScreenGridItem isShowSeparator={false}>
        {delegation.hasDelegated &&
          <React.Fragment>
            <ValidatorScreenGridItem
              value={formatDenom(delegation.balance)}
              labelTx="validatorScreen.delegatorShareLabel"
              isShowSeparator={false}
              isPaddingLess
            />
            <ValidatorScreenGridItem
              value={formatRewards(delegation.rewards)}
              color={delegatorRewardsTextColor}
              labelTx="validatorScreen.delegatorRewardsLabel"
              isShowSeparator={false}
              isPaddingLess
            />
          </React.Fragment>
        }
        {delegation.unbonding.isGreaterThan(0) &&
          <ValidatorScreenGridItem
            value={formatDenom(delegation.unbonding)}
            color="greyBlue"
            labelTx="validatorScreen.delegatorUnbondingShareLabel"
            isShowSeparator={false}
            isPaddingLess
          />
        }
        <View style={Style.StakingContainer}>
          <ButtonGroup
            buttons={[
              {
                key: "delegate",
                tx: "validatorScreen.delegateButtonText",
                onPress: this.onPressDelegateButton,
              },
              {
                key: "undelegate",
                tx: "validatorScreen.undelegateButtonText",
                disabled: !delegation.hasDelegated,
                onPress: this.onPressUndelegateButton,
              },
              {
                key: "redelegate",
                children: (
                  <React.Fragment>
                    <Text
                      style={ButtonTextPresets["button-group"]}
                      disabled={!canRedelegate}
                      tx="validatorScreen.redelegateButtonText"
                    />
                    {delegation.hasDelegated && !canRedelegate &&
                      <Icon
                        name="lock"
                        style={Style.RedelegateButtonIcon}
                      />
                    }
                  </React.Fragment>
                ),
                style: Style.RedelegateButton,
                disabled: !delegation.hasDelegated,
                onPress: canRedelegate ? this.onPressRedelegateButton : this.onPressLockedRedelegateButton,
              },
            ]}
          />
        </View>
      </ValidatorScreenGridItem>
    )
  }

  private renderCivicLikerSection = () => {
    const { status, validatorAddress } = this.props.civicLikerStakingStore
    if (validatorAddress !== this.validator.operatorAddress) {
      return null
    }
    return (
      <CivicLikerV3ControlledSummaryView
        preset={status === "inactive" ? "cta" : "default"}
        onPressButton={this.onPressCivicLikerStakeButton}
      />
    )
  }

  render () {
    const { formatBalance } = this.props.chain
    const validatorAddressLabelTx = `validatorScreen.validatorAddress${this.state.hasCopiedValidatorAddress ? 'Copied' : ''}`

    return (
      <Screen preset="fixed">
        <Header
          leftIcon="arrow-left"
          onLeftPress={this.onPressCloseButton}
        >
          <Animated.View
            style={{
              opacity: this.state.scrollY.interpolate({
                inputRange: [-1, 0, 32, 64, 65],
                outputRange: [0, 0, 0, 1, 1],
              }),
            }}
          >
            <HeaderTitle text={this.validator.moniker} />
          </Animated.View>
        </Header>
        <ScrollView
          animatedValue={this.state.scrollY}
          isWithShadow={true}
          refreshControl={
            <RefreshControl
              tintColor={color.palette.lighterCyan}
              colors={[color.primary]}
              refreshing={this.validator.isLoading}
              onRefresh={this.onRefresh}
            />
          }
        >
          {this.renderIdentitySection()}
          {this.renderDelegationSection()}
          {this.renderCivicLikerSection()}
          <ValidatorScreenGridItem
            labelTx="validator.description"
            isTopLabel
          >
            <Text
              color="white"
              text={this.validator.details}
            />
            {!!this.validator.website &&
              <View style={Style.LinkWrapper}>
                <Button
                  preset="link"
                  tx="validator.website"
                  fontSize="default"
                  link={this.validator.website}
                  style={Style.Link}
                  prepend={
                    <GlobeIcon
                      width={16}
                      height={16}
                      fill={color.palette.lighterCyan}
                    />
                  }
                />
              </View>
            }
          </ValidatorScreenGridItem>
          <ValidatorScreenGridItem
            value={this.props.chain.getValidatorExpectedReturnsPercentage(this.validator)}
            labelTx={"validator.rewards"}
            isHalf
          />
          <ValidatorScreenGridItem
            value={this.props.chain.getValidatorVotingPowerPercentage(this.validator)}
            labelTx={"validator.votingPower"}
            isHalf
          />
          <ValidatorScreenGridItem
            value={formatBalance(this.validator.totalDelegatorShares)}
            labelTx="validator.delegatorShare"
          />
          <ValidatorScreenGridItem
            labelTx={validatorAddressLabelTx}
            isTopLabel
          >
            <TouchableOpacity onPress={this.onPressValidatorAddress}>
              <Text
                color="likeCyan"
                text={this.validator.operatorAddress}
                numberOfLines={1}
                ellipsizeMode="middle"
              />
            </TouchableOpacity>
            <View style={Style.LinkWrapper}>
              <Button
                preset="link"
                tx="common.viewOnBlockExplorer"
                link={this.validator.blockExplorerURL}
                fontSize="default"
                style={Style.Link}
              />
            </View>
          </ValidatorScreenGridItem>
        </ScrollView>
      </Screen>
    )
  }
}
