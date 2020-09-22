import { StyleSheet, TextStyle, ViewStyle } from "react-native"

import { color, spacing } from "../../theme"

import { sizes as fontSizes } from "../../components/text/text.sizes"

export const ReferrerFollowScreenStyle = StyleSheet.create({
  ActionButtonContainer: {
    maxWidth: 414,
    width: "100%",
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    alignItems: "stretch",
  } as ViewStyle,
  Avatar: {
    marginVertical: spacing[3],
  } as ViewStyle,
  DisplayName: {
    color: color.palette.likeCyan,
    fontSize: fontSizes.large,
    fontWeight: "600",
  } as TextStyle,
  Heading: {
    color: color.palette.white,
    fontSize: fontSizes.large,
  } as TextStyle,
  ReferrerView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  Screen: {
    flex: 1,
    backgroundColor: color.primary,
  } as ViewStyle,
  UnfollowButton: {
    marginTop: spacing[1],
    padding: spacing[2],
  } as ViewStyle,
})
