import {
  ImageStyle,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native"

import { spacing, color } from "../../theme"

export default StyleSheet.create({
  ICON: {
    flex: 0,
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: spacing[3],
    backgroundColor: color.palette.white,
  } as ImageStyle,
  INNER: {
    flexDirection: "row",
  } as ViewStyle,
  LEFT_DETAIL: {
    flex: 1,
  } as ViewStyle,
  RIGHT_DETAIL: {
    flex: 0,
    marginLeft: spacing[2],
    justifyContent: "center",
  } as ViewStyle,
  ROOT: {
    margin: spacing[2],
  } as ViewStyle,
  SHEET: {
    paddingHorizontal: spacing[4],
  } as ViewStyle,
  SUBTITLE: {
    fontSize: 10,
    marginTop: spacing[1],
  } as TextStyle,
  TITLE: {
    fontWeight: "500",
  } as TextStyle,
})
