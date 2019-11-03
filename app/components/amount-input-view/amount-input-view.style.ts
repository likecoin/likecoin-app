import {
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native"

import {
  spacing,
  color,
} from "../../theme"

export default {
  SCREEN: {
    flex: 1,
    marginTop: spacing[4],
    padding: spacing[4],
  } as ViewStyle,
  SHEET: {
    flexGrow: 1,
  } as ViewStyle,
  TOP_NAVIGATION: {
    alignItems: "flex-start",
    paddingHorizontal: spacing[2],
    paddingTop: spacing[1],
  } as ViewStyle,
  CONTENT_VIEW: {
    flexGrow: 1,
    paddingHorizontal: spacing[5],
  } as ViewStyle,
  BOTTOM_NAVIGATION: {
    paddingHorizontal: spacing[4],
  } as ViewStyle,
  HEADER: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: spacing[4],
    borderBottomColor: color.palette.lightGrey,
    borderBottomWidth: StyleSheet.hairlineWidth,
  } as ViewStyle,
  AVAILABLE: StyleSheet.create({
    AMOUNT: {
      fontSize: 18,
      maxWidth: 150,
    } as TextStyle,
    ROOT: {
      flexGrow: 1,
    } as ViewStyle,
  }),
  GRAPH: {
    width: 68,
    height: 50,
    flexShrink: 0,
  } as ViewStyle,
  AMOUNT_INPUT_PAD: {
    flexGrow: 1,
  } as ViewStyle,
  DONE_BUTTON: {
    marginTop: spacing[3],
  } as ViewStyle,
}
