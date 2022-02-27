import {
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native"

import {
  spacing,
  color,
} from "../../theme"

export default StyleSheet.create({
  AMOUNT_INPUT_PAD: {
    flexGrow: 1,
  } as ViewStyle,
  AVAILABLE_AMOUNT: {
    fontSize: 18,
    maxWidth: 150,
  } as TextStyle,
  AVAILABLE_ROOT: {
    flexGrow: 1,
  } as ViewStyle,
  BOTTOM_NAVIGATION: {
    paddingHorizontal: spacing[4],
  } as ViewStyle,
  CONTENT_VIEW: {
    paddingHorizontal: spacing[5],
  } as ViewStyle,
  DONE_BUTTON: {
    marginTop: spacing[3],
  } as ViewStyle,
  GRAPH: {
    width: 68,
    height: 56,
    flexShrink: 0,
  } as ViewStyle,
  HEADER: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: spacing[4],
    borderBottomColor: color.palette.lightGrey,
    borderBottomWidth: StyleSheet.hairlineWidth,
  } as ViewStyle,
  SCREEN: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    padding: spacing[4],
  } as ViewStyle,
  SHEET: {
    paddingTop: spacing[4],
  } as ViewStyle,
  TOP_NAVIGATION: {
    alignItems: "flex-start",
    paddingHorizontal: spacing[2],
    paddingTop: spacing[1],
  } as ViewStyle,
})
