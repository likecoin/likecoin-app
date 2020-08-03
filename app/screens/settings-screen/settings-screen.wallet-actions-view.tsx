import * as React from "react"
import { View } from "react-native"

import {
  SettingsScreenWalletActionsViewStyle as Style,
} from "./settings-screen.wallet-actions-view.style"
import {
  SettingsScreenWalletActionsViewProps as Props,
} from "./settings-screen.wallet-actions-view.props"

import { Button } from "../../components/button"
import { ButtonGroup } from "../../components/button-group"
import { Icon } from "../../components/icon"

import { color } from "../../theme"

function NonMemoView(props: Props) {
  return (
    <View style={Style.Root}>
      <View style={Style.DummyQRCodeButton} />
      <View style={Style.SpacerLeft} />
      <Button
        preset="gradient"
        text={props.walletButtonText}
        prepend={(
          <Icon
            name="tab-wallet"
            fill={color.primary}
            width={20}
            style={Style.WalletButtonIcon}
          />
        )}
        textStyle={Style.WalletButtonText}
        style={Style.WalletButton}
        onPress={props.onPressWalletButton}
      />
      <View style={Style.SpacerRight} />
      <ButtonGroup
        buttons={[
          {
            key: "scan",
            preset: "icon",
            icon: "qrcode-scan",
            color: "white",
            style: Style.QRCodeButton,
            onPress: props.onPressQRCodeButton,
          },
        ]}
      />
    </View>
  )
}

NonMemoView.displayName = "SettingsScreenWalletActionsView"

export const SettingsScreenWalletActionsView = React.memo(NonMemoView)
