import {
  StyleSheet,
  ViewStyle,
} from "react-native"

import { color } from "../../theme"

export const GlobalSuperLikedFeedScreenStyle = StyleSheet.create({
  List: {
    backgroundColor: color.palette.lightGreen,
  } as ViewStyle,
  Root: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: color.primary,
  } as ViewStyle,
})
