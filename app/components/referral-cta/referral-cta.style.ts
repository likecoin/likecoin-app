import {
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native"

import { sizes } from "../text/text.sizes"

import {
  color,
  spacing,
} from "../../theme"

export const ReferralCTAStyle = StyleSheet.create({
  Sheet: {
    margin: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: color.primary,
    flexDirection: "row",
  } as ViewStyle,
  Text: {
    flexGrow: 1,
    color: color.palette.white,
    fontSize: sizes.medium,
    fontWeight: "500",
  } as TextStyle,
})
