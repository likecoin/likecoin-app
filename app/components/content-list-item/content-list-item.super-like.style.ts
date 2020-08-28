import { StyleSheet, ViewStyle, TextStyle } from "react-native"

import { color, spacing } from "../../theme"

import { DEFAULT_INSET } from "./content-list-item.style"
import { sizes as fontSize } from "../text/text.sizes"

export const SuperLikeContentListItemStyle = StyleSheet.create({
  AccessoryButton: {
    marginLeft: spacing[1],
  } as ViewStyle,
  AccessoryView: {
    flexShrink: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  } as ViewStyle,
  FooterView: {
    marginTop: spacing[1],
    flexDirection: "row",
    justifyContent: "space-between",
  } as ViewStyle,
  HeaderView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.palette.greyd8,
  } as ViewStyle,
  Inset: {
    paddingHorizontal: DEFAULT_INSET,
  } as ViewStyle,
  MoreButton: {
    marginLeft: spacing[2],
  } as ViewStyle,
  ReadLabel: {
    marginHorizontal: spacing[1],
  } as TextStyle,
  ShareByLabel: {
    color: color.palette.grey9b,
    fontWeight: "500",
  } as TextStyle,
  Title: {
    marginTop: spacing[1],
    color: color.palette.grey4a,
    fontSize: fontSize.medium,
    lineHeight: fontSize.medium * 1.5,
    fontWeight: "600",
  } as TextStyle,
})
