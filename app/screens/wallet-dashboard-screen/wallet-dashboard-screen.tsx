import * as React from "react"
import { NavigationScreenProps } from "react-navigation"
import {
  Image,
  ImageStyle,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import LinearGradient from 'react-native-linear-gradient'
import { observer, inject } from "mobx-react"

import { Button } from "../../components/button"
import { ButtonGroup } from "../../components/button-group"
import { Screen } from "../../components/screen"
import { Sheet } from "../../components/sheet"
import { Text } from "../../components/text"
import { ValidatorListItem } from "../../components/validator-list-item"

import { UserStore } from "../../models/user-store"
import { WalletStore } from "../../models/wallet-store"
import { Validator } from "../../models/validator"

import { percent, formatLIKE } from "../../utils/number"
import { color, gradient, spacing } from "../../theme"

import QRCodeIcon from "../../assets/qrcode-scan.svg"

import { convertNanolikeToLIKE } from "../../services/cosmos/cosmos.utils"

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
    this.props.walletStore.setAddress(this.props.userStore.selectedWalletAddress)
    this._fetchBalance()
    this._fetchValidators()
  }

  _fetchBalance() {
    this.props.walletStore.fetchBalance()
  }

  async _fetchValidators() {
    await this.props.walletStore.fetchAnnualProvision()
    this.props.walletStore.fetchValidators()
  }

  _onPressSendButton = () => {
    this.props.navigation.navigate("Transfer")
  }

  _onPressReceiveButton = () => {
    this.props.navigation.navigate("Receive")
  }

  _onPressQRCodeButton = () => {
    this.props.navigation.navigate("QRCodeScan")
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
                  {
                    key: "scan",
                    preset: "icon",
                    children: (
                      <QRCodeIcon
                        width={16}
                        height={16}
                        fill={color.palette.white}
                      />
                    ),
                    style: QRCODE_BUTTON,
                    onPress: this._onPressQRCodeButton,
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
                {this._renderBalanceValue()}
                <Text
                  text="LikeCoin"
                  color="likeGreen"
                  size="medium"
                  weight="600"
                  align="center"
                  style={WALLET_BALANCE.UNIT}
                />
              </LinearGradient>
              <View style={VALIDATOR_LIST}>
                {this.props.walletStore.validatorList.map(this._renderValidator)}
              </View>
              <View style={DASHBOARD_FOOTER}>
                <Button
                  preset="outlined"
                  tx="common.viewOnBlockExplorer"
                  color="likeCyan"
                  link={this.props.walletStore.blockExplorerURL}
                />
              </View>
            </Sheet>
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
        style={WALLET_BALANCE.AMOUNT}
        text={value}
      />
    )
  }

  _renderValidator = (validator: Validator) => {
    const rightSubtitle = validator.delegatorRewards !== "0" ?
      "+".concat(convertNanolikeToLIKE(validator.delegatorRewards, 2)) : ""
    return (
      <ValidatorListItem
        key={validator.operatorAddress}
        icon={validator.avatar}
        title={validator.moniker}
        subtitle={percent(validator.expectedReturns)}
        rightTitle={formatLIKE(convertNanolikeToLIKE(validator.delegatorShare))}
        rightSubtitle={rightSubtitle}
        isDarkMode={validator.isDelegated}
        onPress={() => this._onPressValidator(validator)}
      />
    )
  }
}
