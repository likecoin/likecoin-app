import { StyleSheet, TextStyle, ViewStyle } from "react-native"

import { sizes } from "../../components/text/text.sizes"

import { color, spacing } from "../../theme"

export const NotificationScreenStyle = StyleSheet.create({
  AmountLabel: {
    fontWeight: "600",
    color: color.palette.green,
  } as TextStyle,
  EmptyLabel: {
    color: color.palette.grey9b,
    fontSize: sizes["medium-large"],
    fontWeight: "600",
  } as TextStyle,
  EmptyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing[8],
  } as ViewStyle,
  List: {
    flex: 1,
    backgroundColor: color.palette.greyf2,
  } as ViewStyle,
  ListContent: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  } as ViewStyle,
  ListItem: {
    marginVertical: spacing[1],
  } as ViewStyle,
  Message: {
    lineHeight: sizes.medium * 1.35,
  } as TextStyle,
  Screen: {
    flex: 1,
    backgroundColor: color.primary,
  } as ViewStyle,
  Separator: {
    height: StyleSheet.hairlineWidth,
    margin: spacing[2],
    backgroundColor: color.palette.greyd8,
  } as ViewStyle,
  UserLabel: {
    fontWeight: "600",
    color: color.palette.likeGreen
  } as TextStyle,
})
