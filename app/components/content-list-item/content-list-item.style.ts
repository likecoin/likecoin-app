import {
  ImageStyle,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native"

import { sizes as fontSize } from "../text/text.sizes"
import { spacing, color } from "../../theme"

export const DEFAULT_INSET = spacing[5]

export const ContentListItemStyle = StyleSheet.create({
  AccessoryButton: {
    marginLeft: spacing[1],
  } as ViewStyle,
  AccessoryView: {
    flexShrink: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  } as ViewStyle,
  CreatorDisplayName: {
    flex: 1,
    color: color.palette.grey9b,
    fontSize: fontSize.default,
    fontWeight: "600",
  } as TextStyle,
  FooterView: {
    marginTop: spacing[1],
    flexDirection: "row",
    justifyContent: "space-between",
  } as ViewStyle,
  ImageView: {
    flex: 0,
    width: 64,
    marginRight: spacing[4],
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: 4,
  } as ImageStyle,
  Inset: {
    paddingHorizontal: DEFAULT_INSET,
  } as ViewStyle,
  Layout: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: spacing[2],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.palette.greyd8,
  } as ViewStyle,
  MoreButton: {
    marginLeft: spacing[2],
  } as ViewStyle,
  RightDetails: {
    flex: 1,
  } as ViewStyle,
  Title: {
    color: color.palette.grey4a,
    fontSize: fontSize.medium,
    lineHeight: fontSize.medium * 1.5,
    fontWeight: "600",
  } as TextStyle,
})
