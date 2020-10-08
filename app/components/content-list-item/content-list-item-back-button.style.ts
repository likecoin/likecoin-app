import { TextStyle, ViewStyle } from "react-native"

import { color, spacing } from "../../theme"

import { sizes as fontSizes } from "../text/text.sizes"

export const BACK_BUTTON_BASE: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  width: 88,
  height: "100%",
  padding: spacing[2],
}

const BACK_BUTTON_TITLE_BASE: TextStyle = {
  fontSize: fontSizes.small,
  fontWeight: "bold",
  textAlign: "center",
  marginTop: spacing[2],
}

export const viewPresets = {
  danger: {
    ...BACK_BUTTON_BASE,
    backgroundColor: color.palette.angry,
  } as ViewStyle,
  neutral: {
    ...BACK_BUTTON_BASE,
    backgroundColor: color.palette.grey9b,
  } as ViewStyle,
  primary: {
    ...BACK_BUTTON_BASE,
    backgroundColor: color.primary,
  } as ViewStyle,
  secondary: {
    ...BACK_BUTTON_BASE,
    backgroundColor: color.palette.lighterCyan,
  } as ViewStyle,
}

const neutralTextPreset: TextStyle = {
  ...BACK_BUTTON_TITLE_BASE,
  color: color.palette.white,
}

export const textPresets = {
  neutral: neutralTextPreset,
  primary: neutralTextPreset,
  secondary: {
    ...BACK_BUTTON_TITLE_BASE,
    color: color.primary,
  } as TextStyle,
  danger: neutralTextPreset,
}

export type ContentListItemBackButtonPreset = keyof typeof viewPresets
