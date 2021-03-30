import * as React from "react"
import {
  Alert,
  Clipboard,
  Image,
  View,
  TouchableOpacity,
  RefreshControl,
} from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import {
  ValidatorScreenStyle as Style,
} from "./validator-screen.style"
import { ValidatorScreenGridItem } from "./validator-screen.grid-item"

import { Button } from "../../components/button"
import { textPresets as ButtonTextPresets } from "../../components/button/button.presets"
import { ButtonGroup } from "../../components/button-group"
import { Icon } from "../../components/icon"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { color } from "../../theme"

import { ChainStore } from "../../models/chain-store"
import { RootStore } from "../../models/root-store"
import { Validator } from "../../models/validator"

import { logAnalyticsEvent } from "../../utils/analytics"

import GlobeIcon from "../../assets/globe.svg"
import { translate } from "../../i18n"

export interface ValidatorScreenNavigationParams {
  validator: Validator
}
export interface ValidatorScreenProps extends NavigationScreenProps<ValidatorScreenNavigationParams> {
  chain: ChainStore,
}

@inject((rootStore: RootStore) => ({
  chain: rootStore.chainStore,
}))
@observer
export class ValidatorScreen extends React.Component<ValidatorScreenProps, {}> {
  state = {
    hasCopiedValidatorAddress: false,
  }

  private getValidator = () => this.props.navigation.getParam("validator")

  private onPressValidatorAddress = () => {
    logAnalyticsEvent('ValidatorCopyWalletAddr')
    Clipboard.setString(this.getValidator().operatorAddress)
    this.setState({ hasCopiedValidatorAddress: true })
  }

  private onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  private onPressDelegateButton = () => {
    logAnalyticsEvent('ValidatorClickDelegate')
    this.props.navigation.navigate("StakingDelegation", {
      target: this.getValidator().operatorAddress,
    })
  }

  private onPressRedelegateButton = () => {
    logAnalyticsEvent('ValidatorClickRedelegate')
    this.props.navigation.navigate("StakingRedelegation", {
      from: this.getValidator().operatorAddress,
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
      target: this.getValidator().operatorAddress,
    })
  }

  private onRefresh = () => {
    const validator = this.getValidator()
    validator.fetchInfo()
    this.props.chain.fetchDelegation(validator.operatorAddress)
    this.props.chain.fetchRewardsFromValidator(validator.operatorAddress)
    this.props.chain.fetchUnbondingDelegation(validator.operatorAddress)
  }

  render () {
    const { formatBalance } = this.props.chain
    const validator = this.getValidator()

    const validatorAddressLabelTx = `validatorScreen.validatorAddress${this.state.hasCopiedValidatorAddress ? 'Copied' : ''}`

    return (
      <Screen
        style={Style.Screen}
        backgroundColor={color.primary}
        preset="scroll"
        refreshControl={
          <RefreshControl
            tintColor={color.palette.lighterCyan}
            colors={[color.primary]}
            refreshing={validator.isLoading}
            onRefresh={this.onRefresh}
          />
        }
      >
        <View style={Style.TopBar}>
          <Button
            preset="icon"
            icon="close"
            color="white"
            onPress={this.onPressCloseButton}
          />
        </View>
        <View style={Style.ContentContainer}>
          {this.renderIdentitySection()}
          {this.renderDelegationSection()}
          <ValidatorScreenGridItem
            labelTx="validator.description"
            isTopLabel
          >
            <Text
              color="white"
              text={validator.details}
            />
            {!!validator.website &&
              <View style={Style.LinkWrapper}>
                <Button
                  preset="link"
                  tx="validator.website"
                  fontSize="default"
                  link={validator.website}
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
            value={this.props.chain.getValidatorExpectedReturnsPercentage(validator)}
            labelTx={"validator.rewards"}
            isHalf
          />
          <ValidatorScreenGridItem
            value={this.props.chain.getValidatorVotingPowerPercentage(validator)}
            labelTx={"validator.votingPower"}
            isHalf
          />
          <ValidatorScreenGridItem
            value={formatBalance(validator.totalDelegatorShares)}
            labelTx="validator.delegatorShare"
          />
          <ValidatorScreenGridItem
            labelTx={validatorAddressLabelTx}
            isTopLabel
          >
            <TouchableOpacity onPress={this.onPressValidatorAddress}>
              <Text
                color="likeCyan"
                text={validator.operatorAddress}
                numberOfLines={1}
                ellipsizeMode="middle"
              />
            </TouchableOpacity>
            <View style={Style.LinkWrapper}>
              <Button
                preset="link"
                tx="common.viewOnBlockExplorer"
                link={validator.blockExplorerURL}
                fontSize="default"
                style={Style.Link}
              />
            </View>
          </ValidatorScreenGridItem>
        </View>
      </Screen>
    )
  }

  private renderIdentitySection = () => {
    const validator = this.getValidator()

    return (
      <ValidatorScreenGridItem
        style={Style.Identity}
        innerStyle={Style.IdentityLayout}
        isShowSeparator={false}
      >
        <Image
          source={{ uri: validator.avatar }}
          style={Style.ValidatorIcon}
        />
        <View style={Style.IdentityRight}>
          <Text
            text={validator.moniker}
            numberOfLines={3}
            adjustsFontSizeToFit
            ellipsizeMode="middle"
            style={Style.ValidatorName}
          />
          <Text
            tx={`validatorScreen.Status.${
              validator.isActive ? "Active" : "Inactive"
            }`}
            style={validator.isActive
              ? Style.StatusActive
              : Style.StatusInactive
            }
          />
        </View>
      </ValidatorScreenGridItem>
    )
  }

  private renderDelegationSection = () => {
    const { operatorAddress: validatorAddress } = this.getValidator()
    const { formatBalance, formatRewards } = this.props.chain
    const delegation = this.props.chain.wallet.getDelegation(validatorAddress)
    const delegatorRewardsTextColor = delegation.hasRewards ? "darkModeGreen" : "white"
    const canRedelegate = this.props.chain.wallet.canRedelegateFromValidator(validatorAddress)
    return (
      <ValidatorScreenGridItem isShowSeparator={false}>
        {delegation.hasDelegated &&
          <React.Fragment>
            <ValidatorScreenGridItem
              value={formatBalance(delegation.balance)}
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
            value={formatBalance(delegation.unbonding, false)}
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
}
