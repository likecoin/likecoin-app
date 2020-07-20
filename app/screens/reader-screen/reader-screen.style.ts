import {
  StyleSheet,
  ViewStyle,
} from "react-native"

import {
  color,
  spacing,
} from "../../theme"

export const ReaderScreenStyle = StyleSheet.create({
  GlobalIcon: {
    marginRight: spacing[3],
  } as ViewStyle,
  List: {
    backgroundColor: color.palette.white,
  } as ViewStyle,
  Root: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: color.primary,
  } as ViewStyle,
})
