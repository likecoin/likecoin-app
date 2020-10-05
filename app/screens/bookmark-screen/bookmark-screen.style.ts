import { StyleSheet, TextStyle, ViewStyle } from "react-native"

import { color, spacing } from "../../theme"

import { sizes as fontSizes } from "../../components/text/text.sizes"

export const BookmarkScreenStyle = StyleSheet.create({
  ContentWrapper: {
    backgroundColor: color.palette.white,
    flex: 1,
  } as ViewStyle,
  Header: {
    paddingHorizontal: spacing[3],
  } as ViewStyle,
  HeaderMiddleView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  List: {
    flex: 1,
  } as ViewStyle,
  Screen: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: color.primary,
  } as ViewStyle,
  Title: {
    color: color.primary,
    fontSize: fontSizes.medium,
    fontWeight: "600",
  } as TextStyle,
})
