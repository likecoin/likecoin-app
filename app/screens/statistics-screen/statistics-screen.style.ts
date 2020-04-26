import { StyleSheet, ViewStyle, TextStyle } from "react-native"

import { sizes } from "../../components/text/text.sizes"

import { color, spacing } from "../../theme"

const DashboardChildrenStyle: ViewStyle = {
  paddingHorizontal: spacing[5],
}

export const StatisticsScreenStyle = StyleSheet.create({
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
  Empty: {
    ...DashboardChildrenStyle,
    paddingVertical: DashboardChildrenStyle.paddingHorizontal,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.palette.white,
  } as ViewStyle,
  EmptyLabel: {
    color: color.palette.grey9b,
    fontSize: sizes.medium,
  } as TextStyle,
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
    backgroundColor: color.palette.offWhite,
    height: 1,
  } as ViewStyle,
  SeparatorWrapper: {
    backgroundColor: color.palette.white,
    paddingHorizontal: DashboardChildrenStyle.paddingHorizontal,
  } as ViewStyle,
})
