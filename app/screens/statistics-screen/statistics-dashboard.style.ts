import { StyleSheet, ViewStyle } from "react-native"

import { spacing } from "../../theme"

const DashboardChildrenStyle: ViewStyle = {
  paddingHorizontal: spacing[5],
}

export const StatisticsDashboardStyle = StyleSheet.create({
  ChartOverlay: {
    ...StyleSheet.absoluteFillObject,
    ...DashboardChildrenStyle,
    alignItems: "center",
    justifyContent: "center"
  } as ViewStyle,
  ChartWrapper: {
    ...DashboardChildrenStyle,
    position: "relative",
    paddingRight: spacing[0],
  } as ViewStyle,
  DataGrid: {
    ...DashboardChildrenStyle,
  } as ViewStyle,
  Root: {
    position: "relative",
    paddingTop: spacing[4],
    paddingBottom: spacing[5],
    // FIXME: Hack to reverse the carousel direction
    transform: [{ scaleX: -1 }],
  } as ViewStyle,
})
