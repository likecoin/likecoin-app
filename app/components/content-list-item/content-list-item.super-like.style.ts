import { StyleSheet, ViewStyle, TextStyle } from "react-native"

import { color, spacing } from "../../theme"

import { sizes as fontSize, sizes } from "../text/text.sizes"

import { ContentListItemStyle as StyleCommon } from "./content-list-item.style"

export const SuperLikeContentListItemStyle = StyleSheet.create({
  HeaderView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.palette.greyd8,
  } as ViewStyle,
  LikerDisplayName: {
    color: color.primary,
    fontSize: fontSize.default,
    fontWeight: "600",
  } as TextStyle,
  ReadIcon: {
    height: 24,
    flexShrink: 0,
    marginHorizontal: spacing[1],
  } as ViewStyle,
  Root: {
    paddingVertical: spacing[4],
  } as ViewStyle,
  ShareByLabel: {
    color: color.palette.grey9b,
    fontSize: sizes.small,
  } as TextStyle,
  Title: StyleSheet.flatten([
    StyleCommon.Title,
    {
      marginTop: spacing[1],
      marginRight: spacing[5] + spacing[1],
    } as TextStyle,
  ]),
})
