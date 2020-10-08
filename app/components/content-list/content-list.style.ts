import { StyleSheet, TextStyle, ViewStyle } from "react-native"

import { color, spacing } from "../../theme"

import { sizes as fontSizes } from "../text/text.sizes"

export const ContentListStyle = StyleSheet.create({
  ContentContainer: {
    flexGrow: 1,
  } as ViewStyle,
  Empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing[4],
  } as ViewStyle,
  EmptyLabel: {
    color: color.palette.grey9b,
    textAlign: "center",
    fontSize: fontSizes.large,
    fontWeight: "600",
  } as TextStyle,
  Footer: {
    paddingBottom: spacing[4],
  } as ViewStyle,
  Full: {
    flex: 1,
  } as ViewStyle,
})

export const RefreshControlColors = [color.primary]
