import {
  StyleSheet,
  ViewStyle,
} from "react-native"

import { color } from "../../theme"

export const ReaderScreenStyle = StyleSheet.create({
  List: {
    backgroundColor: color.palette.white,
  } as ViewStyle,
  Root: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: color.primary,
  } as ViewStyle,
})
