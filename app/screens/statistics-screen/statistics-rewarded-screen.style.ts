import { StyleSheet, ViewStyle, TextStyle } from "react-native"

import { color, spacing } from "../../theme"
import { sizes } from "../../components/text/text.sizes"

const SummarySubtitleBase: TextStyle = {
  fontSize: sizes.default,
  fontWeight: "500",
}

export const StatisticsRewardedScreenStyle = StyleSheet.create({
  Summary: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: color.palette.white,
  } as ViewStyle,
  SummaryIcon: {
    marginLeft: -3,
  } as ViewStyle,
  SummaryItem: {
    alignItems: "flex-end",
    marginLeft: spacing[5],
  } as ViewStyle,
  SummaryLikesCount: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexGrow: 1,
  } as ViewStyle,
  SummaryLikesCountTitle: {
    color: color.palette.grey4a,
    fontSize: sizes.large,
    fontWeight: "500",
  } as TextStyle,
  SummarySubtitle: {
    ...SummarySubtitleBase,
    fontWeight: "normal"
  } as TextStyle,
  SummarySubtitleDecrease: {
    color: color.palette.angry,
  } as TextStyle,
  SummarySubtitleIncrease: {
    color: color.palette.darkModeGreen,
  } as TextStyle,
  SummaryTitle: {
    fontSize: 18,
    color: color.palette.grey4a,
  } as TextStyle,
  SummaryTitleWrapper: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
  } as ViewStyle,
})
