import {
  StyleSheet,
  ViewStyle,
} from "react-native"

import { spacing } from "../../theme"

export const LoadingScreenStyle = StyleSheet.create({
  Animation: {
    flex: 1,
  } as ViewStyle,
  Screen: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[5],
  } as ViewStyle,
})
