import { StyleSheet, ViewStyle } from "react-native"

import { color, spacing } from "../../theme"

import { ContentListItemStyle as StyleCommon } from "./content-list-item.style"

export const BookmarkedContentListItemStyle = StyleSheet.create({
  ActionSheet: {
    backgroundColor: color.transparent,
  } as ViewStyle,
  Layout: StyleSheet.flatten([
    StyleCommon.Layout,
    {
      paddingTop: spacing[2],
      paddingBottom: spacing[4],
    } as ViewStyle,
  ]),
})
