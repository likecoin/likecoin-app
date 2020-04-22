import { StyleSheet, ViewStyle, TextStyle } from "react-native"

import { spacing, color } from "../../theme"
import { sizes } from "../text/text.sizes"

export const StatisticsWeeklyChartStyle = StyleSheet.create({
  Bar: {
    backgroundColor: color.palette.lightGreen,
  } as ViewStyle,
  BarFocused: {
    backgroundColor: color.palette.likeCyan,
  } as ViewStyle,
  Legend: {
    marginRight: spacing[1],
  } as ViewStyle,
  LegendItem: {
    flex: 1,
    alignItems: "flex-start",
    marginRight: spacing[5],
  } as ViewStyle,
  LegendItemSubtitle: {
    color: color.palette.greyBlue,
    fontSize: sizes.default,
  } as TextStyle,
  LegendItemTitle: {
    color: color.palette.white,
    fontSize: sizes.medium,
    fontWeight: "500",
  } as TextStyle,
  Legends: {
    marginTop: spacing[3],
    flexDirection: "row",
  } as ViewStyle,
  Root: {
    backgroundColor: color.primary,
  },
})
