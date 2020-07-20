import {
  StyleSheet,
  ViewStyle,
} from "react-native"

import { color, spacing } from "../../theme"

export const ContentListStyle = StyleSheet.create({
  Empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  Footer: {
    paddingBottom: spacing[4],
  } as ViewStyle,
  Full: {
    flex: 1,
  } as ViewStyle,
  Header: {
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  } as ViewStyle,
})

export const RefreshControlColors = [color.primary]
