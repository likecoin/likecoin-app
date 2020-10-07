import {
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native"

import { sizes } from "../text/text.sizes"
import { color, spacing } from "../../theme"

export const BUTTON_BASE: ViewStyle = {
  alignItems: "center",
  padding: spacing[2],
  justifyContent: "center",
  width: 88,
  height: "100%",
}

const BUTTON_TITLE_BASE: TextStyle = {
  fontSize: sizes.small,
  fontWeight: "bold",
  textAlign: "center",
}

export const ContentListItemBackStyle = StyleSheet.create({
  ButtonDanger: {
    ...BUTTON_BASE,
    backgroundColor: color.palette.angry,
  } as ViewStyle,
  ButtonIcon: {
    marginBottom: spacing[2],
  } as ViewStyle,
  ButtonNeutral: {
    ...BUTTON_BASE,
    backgroundColor: color.palette.grey9b,
  } as ViewStyle,
  ButtonPrimary: {
    ...BUTTON_BASE,
    backgroundColor: color.primary,
  } as ViewStyle,
  ButtonPrimaryTitle: {
    ...BUTTON_TITLE_BASE,
    color: color.palette.white,
  } as TextStyle,
  ButtonSecondary: {
    ...BUTTON_BASE,
    backgroundColor: color.palette.lighterCyan,
  } as ViewStyle,
  ButtonSecondaryTitle: {
    ...BUTTON_TITLE_BASE,
    color: color.primary,
  } as TextStyle,
  Root: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "stretch",
  } as ViewStyle,
})

export const ICON_PROPS = {
  width: 24,
  height: 24,
  style: ContentListItemBackStyle.ButtonIcon,
}
