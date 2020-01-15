import * as React from "react"
import {
  Clipboard,
  Image,
  ImageStyle,
  TextStyle,
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity,
  RefreshControl,
} from "react-native"
import { NavigationScreenProps, SafeAreaView } from "react-navigation"
import { inject, observer } from "mobx-react"

import { ValidatorScreenGridItem } from "./validator-screen.grid-item"

import { Button } from "../../components/button"
import { ButtonGroup } from "../../components/button-group"
import { Text } from "../../components/text"
import { sizes } from "../../components/text/text.sizes"
import { Screen } from "../../components/screen"
import { color, spacing } from "../../theme"

import { ChainStore } from "../../models/chain-store"
import { RootStore } from "../../models/root-store"
import { Validator } from "../../models/validator"

import { logAnalyticsEvent } from "../../utils/analytics"

import GlobeIcon from "../../assets/globe.svg"

export interface ValidatorScreenNavigationParams {
  validator: Validator
}
export interface ValidatorScreenProps extends NavigationScreenProps<ValidatorScreenNavigationParams> {
  chain: ChainStore,
}

const ROOT: ViewStyle = {
  flex: 1,
  backgroundColor: color.primary,
}
const SCREEN: ViewStyle = {
  flexGrow: 1,
}
const CONTENT_CONTAINER: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  flexWrap: "wrap",
  paddingHorizontal: spacing[5],
  paddingBottom: spacing[5],
}
const IDENTITY = StyleSheet.create({
  INNER: {
    alignItems: "center",
    flexDirection: "row",
  },
  ROOT: {
    flexBasis: "100%",
  },
})
const STAKING = StyleSheet.create({
  CONTAINER: {
    alignItems: "center",
  } as ViewStyle,
})

const VALIDATOR_ICON: ImageStyle = {
  width: 64,
  height: 64,
  borderRadius: 12,
  marginRight: spacing[3],
}
const VALIDATOR_NAME: TextStyle = {
  color: color.palette.likeCyan,
  fontSize: sizes.large,
  fontWeight: "500",
  flex: 1,
}
const LINK_WRAPPER: ViewStyle = {
  flexDirection: "row",
}
const LINK: ViewStyle = {
  marginTop: spacing[4],
}
const BOTTOM_BAR: ViewStyle = {
  alignItems: "center",
  width: "100%",
  padding: spacing[3],
  backgroundColor: color.palette.white,
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

  private onPressUndelegateButton = () => {
    logAnalyticsEvent('ValidatorClickUndelegate')
    this.props.navigation.navigate("StakingUnbondingDelegation", {
      target: this.getValidator().operatorAddress,
    })
  }

  render () {
    const { formatBalance } = this.props.chain
    const validator = this.getValidator()

    const validatorAddressLabelTx = `validatorScreen.validatorAddress${this.state.hasCopiedValidatorAddress ? 'Copied' : ''}`

    return (
      <View style={ROOT}>
        <Screen
          style={SCREEN}
          backgroundColor={color.transparent}
          preset="scroll"
          refreshControl={
            <RefreshControl
              tintColor={color.palette.lighterCyan}
              colors={[color.primary]}
              refreshing={validator.isFetchingInfo}
              onRefresh={validator.fetchInfo}
            />
          }
        >
          <View style={CONTENT_CONTAINER}>
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
                <View style={LINK_WRAPPER}>
                  <Button
                    preset="link"
                    tx="validator.website"
                    size="default"
                    link={validator.website}
                    style={LINK}
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
              <View style={LINK_WRAPPER}>
                <Button
                  preset="link"
                  tx="common.viewOnBlockExplorer"
                  link={validator.blockExplorerURL}
                  size="default"
                  style={LINK}
                />
              </View>
            </ValidatorScreenGridItem>
          </View>
        </Screen>
        <SafeAreaView
          forceInset={{ top: "never", bottom: "always" }}
          style={BOTTOM_BAR}
        >
          <Button
            preset="icon"
            icon="close"
            color="likeGreen"
            onPress={this.onPressCloseButton}
          />
        </SafeAreaView>
      </View>
    )
  }

  private renderIdentitySection = () => {
    const validator = this.getValidator()

    return (
      <ValidatorScreenGridItem
        style={IDENTITY.ROOT}
        innerStyle={IDENTITY.INNER}
        isShowSeparator={false}
      >
        <Image
          source={{ uri: validator.avatar }}
          style={VALIDATOR_ICON}
        />
        <Text
          text={validator.moniker}
          numberOfLines={3}
          adjustsFontSizeToFit
          ellipsizeMode="middle"
          style={VALIDATOR_NAME}
        />
      </ValidatorScreenGridItem>
    )
  }

  private renderDelegationSection = () => {
    const validator = this.getValidator()
    const { formatBalance, formatRewards } = this.props.chain
    const delegation = this.props.chain.wallet.getDelegation(validator.operatorAddress)
    const delegatorRewardsTextColor = delegation.hasRewards ? "darkModeGreen" : "white"
    return (
      <ValidatorScreenGridItem isShowSeparator={false}>
        {delegation.hasDelegated &&
          <React.Fragment>
            <ValidatorScreenGridItem
              value={formatBalance(delegation.shares)}
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
        <View style={STAKING.CONTAINER}>
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
            ]}
          />
        </View>
      </ValidatorScreenGridItem>
    )
  }
}
