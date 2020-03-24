import {
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native"

import { sizes } from "../../components/text/text.sizes"

import { color, spacing } from "../../theme"

export const SaveToBookmarkScreenStyle = StyleSheet.create({
  Handle: {
    height: 4,
    width: 32,
    borderRadius: 2,
    backgroundColor: color.palette.likeCyan,
    opacity: 0.5,
  } as ViewStyle,
  HandleWrapper: {
    alignItems: "center",
  } as ViewStyle,
  Inner: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  LabelURL: {
    marginTop: spacing[2],
    paddingHorizontal: spacing[3],
    color: color.palette.greyf2,
    fontSize: sizes.default,
    textAlign: "center",
  } as TextStyle,
  Root: {
    flex: 1,
    backgroundColor: color.primary,
    padding: spacing[3],
  } as ViewStyle,
})
