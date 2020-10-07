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
  AccessoryView: {
    flexShrink: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  } as ViewStyle,
  CreatorDisplayName: {
    flex: 1,
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
  Root: {
    position: "relative",
    paddingVertical: spacing[4],
  } as ViewStyle,
  RootUndo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: DEFAULT_INSET,
    backgroundColor: color.palette.greyf7,
  } as ViewStyle,
  Title: {
    color: color.palette.grey4a,
    fontSize: fontSize.medium,
    lineHeight: fontSize.medium * 1.5,
    fontWeight: "600",
  } as TextStyle,
  Underlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color.palette.grey4a,
  } as ViewStyle,
  UndoButton: {
    flexShrink: 0,
    marginLeft: spacing[2],
    paddingHorizontal: 0,
  } as ViewStyle,
  UndoButtonIcon: {
    marginLeft: 0,
  } as ViewStyle,
  UndoTextWrapper: {
    flexShrink: 1,
    flexGrow: 1,
    overflow: "hidden",
  } as ViewStyle,
})
