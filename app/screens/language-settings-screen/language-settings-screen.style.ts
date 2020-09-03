import { StyleSheet, ViewStyle } from "react-native"

import { spacing, color } from "../../theme"

export const LanguageSettingsScreenStyle = StyleSheet.create({
  List: {
    flex: 1,
    backgroundColor: color.palette.white,
  } as ViewStyle,
  ListItem: {
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: spacing[4],
  } as ViewStyle,
  Screen: {
    backgroundColor: color.primary,
  } as ViewStyle,
  Separator: {
    backgroundColor: color.palette.greyd8,
    height: StyleSheet.hairlineWidth,
    marginHorizontal: spacing[4],
  } as ViewStyle,
})
