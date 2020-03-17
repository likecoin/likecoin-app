import {
  StyleSheet,
  ViewStyle,
} from "react-native"

import { color, spacing } from "../../theme"

export const FollowSettingsListItemStyle = StyleSheet.create({
  Avatar: {
    marginRight: spacing[2],
  } as ViewStyle,
  Left: {
    overflow: "hidden",
    flexShrink: 1,
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing[2],
    paddingVertical: spacing[2],
  } as ViewStyle,
  Right: {
    flexShrink: 0,
    padding: spacing[2],
    paddingRight: spacing[4],
  } as ViewStyle,
  Root: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: spacing[4],
    backgroundColor: color.palette.white,
    borderTopColor: color.palette.grey9b,
    borderTopWidth: StyleSheet.hairlineWidth,
  } as ViewStyle,
  RootToggled: {
    backgroundColor: color.palette.greyf7,
  } as ViewStyle,
  UnfollowButton: {
    flexShrink: 0,
    backgroundColor: color.palette.likeBrown,
    borderRadius: 0,
    height: "100%",
    paddingHorizontal: spacing[4],
  } as ViewStyle,
})
