import { StyleSheet, ViewStyle, TextStyle } from "react-native"

import { color, spacing } from "../../theme"
import { sizes } from "../text/text.sizes"

const BaseTitle: TextStyle = {
  color: color.palette.grey4a,
  fontSize: sizes.medium,
  fontWeight: "500",
  flexShrink: 1,
  lineHeight: 20,
}

export const StatisticsListItemStyle = StyleSheet.create({
  Avatar: {
    marginRight: spacing[2],
  } as ViewStyle,
  Button: {
    backgroundColor: color.palette.white,
  } as ViewStyle,
  LikeAmountText: {
    color: color.palette.grey4a,
    fontSize: 18,
    fontWeight: "500",
  } as TextStyle,
  LikeAmountUnitLabel: {
    fontSize: sizes.small,
    color: color.palette.grey4a,
  } as TextStyle,
  MainDetailsLeftView: {
    flex: 1,
    flexDirection: "row",
  } as ViewStyle,
  MainDetailsRightView: {
    alignItems: "flex-end",
    flexShrink: 0,
    marginLeft: spacing[4],
  } as ViewStyle,
  MainDetailsView: {
    flexDirection: "row",
  } as ViewStyle,
  SubDetailsItem: {
    flexDirection: "row",
  } as ViewStyle,
  SubDetailsItemIcon: {
    marginRight: spacing[1],
  } as ViewStyle,
  SubDetailsLeftView: {
  } as ViewStyle,
  SubDetailsText: {
    color: color.palette.grey9b,
    fontSize: sizes.medium,
    lineHeight: 24,
  } as TextStyle,
  SubDetailsView: {
    flexDirection: "row",
    marginTop: spacing[2],
  } as ViewStyle,
  Subtitle: {
    color: color.primary,
    fontSize: sizes.default,
    fontWeight: "500",
  } as TextStyle,
  Title: {
    ...BaseTitle,
  } as TextStyle,
  TitleWithAvatar: {
    ...BaseTitle,
    alignSelf: "center",
  } as TextStyle,
  WorkCountText: {
    marginLeft: spacing[5],
  } as TextStyle,
  Wrapper: {
    marginHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
  } as ViewStyle,
})
