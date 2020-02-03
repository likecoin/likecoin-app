import {
  StyleSheet,
  ViewStyle,
  TextStyle
} from "react-native"

import { spacing, color } from "../../theme"

export const SettingScreenStyle = StyleSheet.create({
  Body: {
    flexGrow: 1,
    padding: spacing[4],
  } as ViewStyle,
  Header: {
    paddingVertical: spacing[5],
  } as ViewStyle,
  Root: {
    flexGrow: 1,
  } as ViewStyle,
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
