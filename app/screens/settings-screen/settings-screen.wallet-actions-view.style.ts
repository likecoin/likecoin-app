import {
  Dimensions,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native"

import { spacing } from "../../theme"

const QRCODE_BUTTON_WIDTH = 44
const ROOT_X_PADDING = spacing[4]
const SPACER_RIGHT_WIDTH = spacing[2]

export const SettingsScreenWalletActionsViewStyle = StyleSheet.create({
  DummyQRCodeButton: {
    maxWidth: 44,
    flexGrow: 1,
    flexShrink: 1,
  } as ViewStyle,
  QRCodeButton: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    width: QRCODE_BUTTON_WIDTH,
  } as ViewStyle,
  Root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing[4],
    paddingHorizontal: ROOT_X_PADDING,
    maxWidth: Dimensions.get("window").width,
  } as ViewStyle,
  SpacerLeft: {
    maxWidth: spacing[2],
    flexGrow: 1,
    flexShrink: 1,
  } as ViewStyle,
  SpacerRight: {
    minWidth: SPACER_RIGHT_WIDTH,
    flexGrow: 0,
    flexShrink: 0,
  } as ViewStyle,
  WalletButton: {
    position: "relative",
    minWidth: 160,
    maxWidth:
      Dimensions.get("window").width -
      ROOT_X_PADDING * 2 -
      QRCODE_BUTTON_WIDTH -
      SPACER_RIGHT_WIDTH,
  } as ViewStyle,
  WalletButtonIcon: {
    position: "absolute",
    left: spacing[3],
  } as ViewStyle,
  WalletButtonText: {
    flexGrow: 1,
    paddingLeft: spacing[6],
    paddingRight: spacing[2],
    textAlign: "center",
  } as TextStyle,
})
