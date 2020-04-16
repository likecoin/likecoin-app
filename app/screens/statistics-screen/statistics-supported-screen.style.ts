import { StyleSheet, ViewStyle, TextStyle } from "react-native"

import { color, spacing } from "../../theme"

const DashboardChildrenStyle: ViewStyle = {
  paddingHorizontal: spacing[5],
}

export const StatisticsSupportedScreenStyle = StyleSheet.create({
  Backdrop: {
    flex: 0.5,
    backgroundColor: color.primary,
  } as ViewStyle,
  BackdropWrapper: {
    ...StyleSheet.absoluteFillObject,
  } as ViewStyle,
  Carousel: {
    backgroundColor: color.primary,
    // FIXME: Hack to reverse the carousel direction
    transform: [{ scaleX: -1 }],
  } as ViewStyle,
  List: {
    flex: 1,
  } as ViewStyle,
  ListHeaderText: {
    color: color.primary,
    backgroundColor: color.palette.lightGreen,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2] - spacing[1],
    fontWeight: "500",
  } as TextStyle,
  Screen: {
    position: "relative",
    flex: 1,
  } as ViewStyle,
  Separator: {
    marginHorizontal: DashboardChildrenStyle.paddingHorizontal,
    backgroundColor: color.palette.offWhite,
    height: 1,
  } as ViewStyle,
})
