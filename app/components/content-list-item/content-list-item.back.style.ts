import {
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native"

import { sizes } from "../text/text.sizes"
import { color, spacing } from "../../theme"

const ButtonBase: ViewStyle = {
  alignItems: "center",
  padding: spacing[2],
  justifyContent: "center",
  width: 64,
  height: "100%",
}

export const ContentListItemBackStyle = StyleSheet.create({
  ButtonBookmark: {
    ...ButtonBase,
    backgroundColor: color.palette.likeCyan,
  } as ViewStyle,
  ButtonFollow: {
    ...ButtonBase,
    backgroundColor: color.primary,
  } as ViewStyle,
  ButtonIcon: {
    marginBottom: spacing[2],
  } as ViewStyle,
  ButtonTitle: {
    fontSize: sizes.small,
    fontWeight: "bold",
    textAlign: "center",
    color: color.palette.white,
  } as TextStyle,
  ButtonUnbookmark: {
    ...ButtonBase,
    backgroundColor: color.palette.angry,
  } as ViewStyle,
  ButtonUnfollow: {
    ...ButtonBase,
    backgroundColor: color.palette.grey9b,
  } as ViewStyle,
  Root: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "stretch",
  } as ViewStyle,
})

export const ICON_PROPS = {
  width: 24,
  height: 24,
  fill: color.palette.white,
  style: ContentListItemBackStyle.ButtonIcon,
}
