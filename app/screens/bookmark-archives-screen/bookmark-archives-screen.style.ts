import { ViewStyle, StyleSheet } from "react-native"

import { color } from "../../theme"

export const BookmarkArchivesScreenStyle = StyleSheet.create({
  List: {
    flex: 1,
    backgroundColor: color.palette.white,
  } as ViewStyle,
  Screen: {
    flex: 1,
    backgroundColor: color.primary,
  } as ViewStyle,
})
