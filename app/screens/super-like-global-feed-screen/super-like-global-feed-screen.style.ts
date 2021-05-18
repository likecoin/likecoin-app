import { StyleSheet, ViewStyle } from "react-native"

import { color } from "../../theme"

export const SuperLikeGlobalFeedScreenStyle = StyleSheet.create({
  List: {
    flex: 1,
    backgroundColor: color.palette.greyf7,
  } as ViewStyle,
  Root: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: color.primary,
  } as ViewStyle,
})
