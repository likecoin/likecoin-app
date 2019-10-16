import * as React from "react"
import { NavigationScreenProps } from "react-navigation"
import { ViewStyle, View, Image, TextStyle, ImageStyle } from "react-native"
import LinearGradient from 'react-native-linear-gradient'
import { observer, inject } from "mobx-react"

import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { ButtonGroup } from "../../components/button-group"
import { ValidatorListItem } from "../../components/validator-list-item"

import { UserStore } from "../../models/user-store"
import { WalletStore } from "../../models/wallet-store"
import { Validator } from "../../models/validator"

import { percent } from "../../utils/number"
import { color, gradient, spacing } from "../../theme"

export interface WalletDashboardScreenProps extends NavigationScreenProps<{}> {
  userStore: UserStore
  walletStore: WalletStore
}

const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.primary,
}
const SCREEN: ViewStyle = {
  flexGrow: 1,
}
const DASHBOARD_HEADER: ViewStyle = {
  padding: 24,
  paddingBottom: 64,
}
const USER_INFO_ROOT: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}
const USER_INFO_AVATAR: ImageStyle = {
  width: 64,
  height: 64,
  borderRadius: 32,
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
  marginTop: 16,
}
const DASHBOARD_BODY: ViewStyle = {
  flexGrow: 1,
  backgroundColor: color.palette.white,
  paddingHorizontal: 12,
}
const DASHBOARD_BODY_INNER: ViewStyle = {
  flex: 1,
  backgroundColor: color.palette.white,
  marginTop: -40,
  borderTopLeftRadius: 14,
  borderTopRightRadius: 14,
  shadowColor: color.palette.black,
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.27,
  shadowRadius: 4.65,
  elevation: 6,
}
const WALLET_BALANCE_PANEL: ViewStyle = {
  borderTopLeftRadius: DASHBOARD_BODY_INNER.borderTopLeftRadius,
  borderTopRightRadius: DASHBOARD_BODY_INNER.borderTopLeftRadius,
  paddingVertical: 28,
  paddingHorizontal: 12,
}
const WALLET_BALANCE_VALUE: TextStyle = {
  color: color.primary,
  fontSize: 36,
  fontWeight: "500",
  textAlign: "center",
}
const VALIDATOR_LIST: ViewStyle = {
  padding: spacing[2],
}

@inject(
  "userStore",
  "walletStore"
)
@observer
export class WalletDashboardScreen extends React.Component<WalletDashboardScreenProps, {}> {
  componentDidMount() {
    this._fetchBalance()
    this._fetchValidators()
  }

  _fetchBalance() {
    this.props.walletStore.fetchBalance(this.props.userStore.authCore.cosmosAddress)
  }

  async _fetchValidators() {
    await this.props.walletStore.fetchAnnualProvision()
    this.props.walletStore.fetchValidators()
  }

  _onPressSendButton = () => {
    // TODO: Navigation to send screen
  }

  _onPressReceiveButton = () => {
    this.props.navigation.navigate("Receive")
  }

  _onPressValidator = (validator: Validator) => {
    this.props.navigation.navigate("Validator", {
      validator,
    })
  }

  render () {
    const { currentUser } = this.props.userStore
    return (
      <View style={FULL}>
        <Screen
          style={SCREEN}
          backgroundColor={color.transparent}
          preset="scroll"
        >
          <View style={DASHBOARD_HEADER}>
            {currentUser &&
              <View style={USER_INFO_ROOT}>
                <Image
                  style={USER_INFO_AVATAR}
                  source={{ uri: currentUser.avatarURL }}
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
                    onPress: this._onPressSendButton,
                  },
                  {
                    key: "receive",
                    tx: "walletDashboardScreen.receive",
                    onPress: this._onPressReceiveButton,
                  },
                ]}
              />
            </View>
          </View>
          <View style={DASHBOARD_BODY}>
            <View style={DASHBOARD_BODY_INNER}>
              <LinearGradient
                colors={gradient.LikeCoin}
                start={{ x: 0.0, y: 1.0 }}
                end={{ x: 1.0, y: 0.0 }}
                style={WALLET_BALANCE_PANEL}
              >
                {this._renderBalanceValue()}
              </LinearGradient>
              <View style={VALIDATOR_LIST}>
                {this.props.walletStore.validatorList.map(this._renderValidator)}
              </View>
            </View>
          </View>
        </Screen>
      </View>
    )
  }

  _renderBalanceValue = () => {
    let value: string
    const {
      isFetchingBalance: isFetching,
      hasFetchedBalance: hasFetch,
      formattedBalance: balanceValue,
    } = this.props.walletStore
    if (hasFetch) {
      value = balanceValue
    } else if (isFetching) {
      value = "..."
    }
    return (
      <Text
        style={WALLET_BALANCE_VALUE}
        text={value}
      />
    )
  }

  _renderValidator = (validator: Validator) => {
    return (
      <ValidatorListItem
        key={validator.operatorAddress}
        name={validator.moniker}
        icon={validator.avatar}
        subtitle={percent(validator.expectedReturns)}
        onPress={() => this._onPressValidator(validator)}
      />
    )
  }
}
