import { Dimensions, StyleSheet, TextStyle, ViewStyle } from "react-native"

import { color, spacing } from "../../theme"

import { sizes } from "../../components/text/text.sizes"

export const SuperLikeFollowingScreenStyle = StyleSheet.create({
  ContentWrapper: {
    backgroundColor: color.palette.white,
    flex: 1,
  } as ViewStyle,
  DateLabel: {
    minWidth: 132,
    color: color.palette.grey4a,
    fontWeight: "600",
    fontSize: sizes.medium,
    textAlign: "center",
  } as TextStyle,
  EmptyList: {
    flex: 1,
  } as ViewStyle,
  GlobalIcon: {
    marginRight: spacing[3],
  } as ViewStyle,
  List: {
    backgroundColor: color.palette.white,
  } as ViewStyle,
  Page: {
    flex: 1,
    width: Dimensions.get("window").width,
  } as ViewStyle,
  PageList: {
    flex: 1,
  } as ViewStyle,
  Root: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: color.primary,
  } as ViewStyle,
  SuperLikeHeader: {
    paddingHorizontal: spacing[3],
  } as ViewStyle,
  SuperLikeHeaderMiddleView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  TodayButtonText: {
    flexShrink: 0,
    marginRight: -spacing[2],
  } as TextStyle,
})
