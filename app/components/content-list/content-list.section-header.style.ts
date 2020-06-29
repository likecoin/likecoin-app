import {
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native"

import { sizes } from "../text/text.sizes"

import {
  color,
  spacing,
} from "../../theme"

export const ContentListSectionHeaderStyle = StyleSheet.create({
  Root: {
    marginTop: spacing[5],
    marginHorizontal: spacing[5],
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: color.palette.offWhite,
  } as ViewStyle,
  Text: {
    color: color.palette.grey9b,
    fontSize: sizes.medium,
  } as TextStyle,
})
