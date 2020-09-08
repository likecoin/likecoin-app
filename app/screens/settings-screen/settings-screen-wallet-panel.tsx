import * as React from "react"
import { TouchableHighlight, View } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { inject, observer } from "mobx-react"

import { gradient } from "../../theme"

import { ChainStore } from "../../models/chain-store"

import { ButtonGroup } from "../../components/button-group"
import { Icon } from "../../components/icon"
import { Text } from "../../components/text"

import { SETTINGS_MENU } from "./settings-screen.style"
import { SettingsScreenStatisticsPanelStyle as CommonStyle } from "./settings-screen-statistics-panel.style"
import { SettingsScreenWalletPanelStyle as Style } from "./settings-screen-wallet-panel.style"

export interface SettingsScreenWalletPanelProps {
  chainStore?: ChainStore
  onPress?: () => void
  onPressQRCodeButton?: () => void
}

@inject("chainStore")
@observer
export class SettingsScreenWalletPanel extends React.Component<
  SettingsScreenWalletPanelProps
> {
  componentDidMount() {
    this.props.chainStore.fetchAll()
  }

  render() {
    return (
      <View style={[SETTINGS_MENU.TABLE, CommonStyle.Table]}>
        <TouchableHighlight
          underlayColor={CommonStyle.ButtonUnderlaying.backgroundColor}
          style={[
            SETTINGS_MENU.TABLE_CELL_FIRST_CHILD,
            SETTINGS_MENU.TABLE_CELL_LAST_CHILD,
          ]}
          onPress={this.props.onPress}
        >
          <LinearGradient
            colors={gradient.LikeCoin}
            start={{ x: 0.0, y: 1.0 }}
            end={{ x: 1.0, y: 0.0 }}
            style={CommonStyle.Button}
          >
            <View style={CommonStyle.ButtonContent}>
              <View style={Style.Header}>
                <Icon
                  name="tab-wallet"
                  color="likeGreen"
                  width={16}
                  height={16}
                />
                <Text
                  tx="settingsScreen.Panel.Wallet.Title"
                  style={Style.HeaderText}
                />
                <Icon
                  name="arrow-right"
                  color="likeGreen"
                  width={16}
                  height={16}
                />
              </View>
              <Text
                text={this.props.chainStore.formattedConciseTotalBalance}
                style={Style.BalanceLabel}
              />
            </View>
            <ButtonGroup
              buttons={[
                {
                  key: "scan",
                  preset: "icon",
                  icon: "qrcode-scan",
                  color: "likeGreen",
                  style: Style.QRCodeButton,
                  onPress: this.props.onPressQRCodeButton,
                },
              ]}
              style={Style.QRCodeButtonWrapper}
            />
          </LinearGradient>
        </TouchableHighlight>
      </View>
    )
  }
}
