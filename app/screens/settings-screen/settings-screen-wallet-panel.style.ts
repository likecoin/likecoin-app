import { StyleSheet, ViewStyle, TextStyle } from "react-native"

import { spacing, color } from "../../theme"
import { sizes } from "../../components/text/text.sizes"

const QRCODE_BUTTON_WIDTH = 44

export const SettingsScreenWalletPanelStyle = StyleSheet.create({
  BalanceLabel: {
    marginTop: spacing[2],
    color: color.primary,
    fontSize: sizes.large,
    fontWeight: "600",
  } as TextStyle,
  Header: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  HeaderText: {
    marginHorizontal: spacing[1],
    color: color.primary,
    fontSize: sizes.default,
    fontWeight: "600",
  } as TextStyle,
  QRCodeButton: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    width: QRCODE_BUTTON_WIDTH,
  } as ViewStyle,
  QRCodeButtonWrapper: {
    marginRight: spacing[2],
    backgroundColor: color.palette.grey9b + "33",
  } as ViewStyle,
})
