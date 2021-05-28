import { StyleSheet, TextStyle, ViewStyle } from "react-native"
import { color } from "../../theme"

export const SettingsScreenUserInfoPanelStyle = StyleSheet.create({
  DisplayName: {
    color: color.palette.white,
    fontSize: 28,
    fontWeight: "500",
  } as TextStyle,
  Identity: {
    flex: 1,
    marginLeft: 12,
  } as ViewStyle,
  UserID: {
    color: color.palette.white,
    opacity: 0.6,
    fontSize: 12,
  } as TextStyle,
})
