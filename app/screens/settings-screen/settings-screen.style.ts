import { StyleSheet, ViewStyle, TextStyle } from "react-native"

import { spacing, color } from "../../theme"

export const SettingScreenStyle = StyleSheet.create({
  Body: {
    flexGrow: 1,
    padding: spacing[4],
  } as ViewStyle,
  Root: {
    flexGrow: 1,
  } as ViewStyle,
})

export const SettingScreenHeaderStyle = StyleSheet.create({
  ButtonsContainer: {
    position: "relative",
    alignItems: "center",
    marginTop: spacing[4],
    marginHorizontal: spacing[4],
  } as ViewStyle,
  QRCodeButton: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    width: 44,
  } as ViewStyle,
  QRCodeButtonGroup: {
    position: "absolute",
    right: 0,
  } as ViewStyle,
  Root: {
    paddingVertical: spacing[5],
  } as ViewStyle,
  WalletButton: {
    position: "relative",
    minWidth: 160,
    marginHorizontal: spacing[2],
  } as ViewStyle,
  WalletButtonIcon: {
    position: "absolute",
    left: spacing[3],
  } as ViewStyle,
  WalletButtonTextStyle: {
    flexGrow: 1,
    paddingLeft: spacing[6],
    paddingRight: spacing[2],
    textAlign: "center",
  } as TextStyle,
})

export const SettingScreenUserInfoStyle = StyleSheet.create({
  DisplayName: {
    color: color.palette.white,
    fontSize: 28,
    fontWeight: "500",
  } as TextStyle,
  Identity: {
    marginLeft: 12,
  } as ViewStyle,
  Root: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[5],
  } as ViewStyle,
  UserID: {
    color: color.palette.white,
    opacity: 0.6,
    fontSize: 12,
  } as TextStyle,
})
