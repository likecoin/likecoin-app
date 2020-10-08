import { StyleSheet, ViewStyle } from "react-native"

import { spacing } from "../../theme"

import { ContentListItemStyle as StyleCommon } from "./content-list-item.style"

export const BookmarkedContentListItemStyle = StyleSheet.create({
  Layout: StyleSheet.flatten([
    StyleCommon.Layout,
    {
      paddingTop: spacing[2],
      paddingBottom: spacing[4],
    } as ViewStyle,
  ]),
})
