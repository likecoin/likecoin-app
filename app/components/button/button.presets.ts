import { ViewStyle, TextStyle } from "react-native"

import { sizes } from "../text/text.sizes"

import { color, spacing } from "../../theme"

const SIZE = {
  default: 44,
  small: 36,
  tiny: 24,
}

/**
 * A list of sizes.
 */
export type ButtonSize = keyof typeof SIZE

/**
 * All view will start off looking like this.
 */
const BASE_VIEW: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
}

/**
 * All text will start off looking like this.
 */
const BASE_TEXT: TextStyle = {
  fontWeight: "bold",
  paddingHorizontal: spacing[2],
}

/**
 * All link will start off looking like this.
 */
const BASE_TEXT_LINK: TextStyle = {
  ...BASE_TEXT,
  paddingHorizontal: 0,
  paddingVertical: 0,
  textDecorationLine: "underline",
}

/**
 * All the variations of text styling within the app.
 */
export const viewPresets = {
  /**
   * A plain style button
   */
  plain: {
    ...BASE_VIEW,
  } as ViewStyle,

  /**
   * A smaller piece of secondard information.
   */
  primary: {
    ...BASE_VIEW,
    backgroundColor: color.palette.lighterCyan,
  } as ViewStyle,

  secondary: {
    ...BASE_VIEW,
    backgroundColor: color.palette.grey9b + "33",
  } as ViewStyle,

  danger: {
    ...BASE_VIEW,
    backgroundColor: color.palette.angry,
  } as ViewStyle,

  /**
   * A outlined style button
   */
  outlined: {
    ...BASE_VIEW,
    backgroundColor: "transparent",
    borderColor: color.palette.lighterCyan,
    borderWidth: 1,
  } as ViewStyle,

  /**
   * A outlined style button
   */
  "secondary-outlined": {
    ...BASE_VIEW,
    backgroundColor: "transparent",
    borderColor: color.palette.grey9b,
    borderWidth: 2,
  } as ViewStyle,

  /**
   * A gradient style button
   */
  gradient: {
    ...BASE_VIEW,
  },

  /**
   * A button without extras.
   */
  link: {
    ...BASE_VIEW,
  } as ViewStyle,
  "link-dark": {
    ...BASE_VIEW,
  } as ViewStyle,
  "link-plain": {
    ...BASE_VIEW,
  } as ViewStyle,

  /**
   * A icon button.
   */
  icon: {
    ...BASE_VIEW,
    padding: spacing[2],
  },

  /**
   * A button group preset.
   */
  "button-group": {
    ...BASE_VIEW,
    paddingHorizontal: spacing[2],
  },
}

export const viewSizePresets = {
  default: {
    minWidth: SIZE.default,
    minHeight: SIZE.default,
    borderRadius: 12,
  } as ViewStyle,
  small: {
    minWidth: SIZE.small,
    minHeight: SIZE.small,
    borderRadius: 12,
  } as ViewStyle,
  tiny: {
    minWidth: SIZE.tiny,
    minHeight: SIZE.tiny,
    borderRadius: 8,
  } as ViewStyle,
}

export const textSizePresets = {
  default: {
    fontSize: sizes.medium,
  } as TextStyle,
  small: {
    fontSize: sizes.default,
  } as TextStyle,
  tiny: {
    fontSize: sizes.small,
  } as TextStyle,
}

export const iconSizePresets = {
  default: 28,
  small: 24,
  tiny: 20,
}

export const textPresets = {
  primary: {
    ...BASE_TEXT,
    color: color.palette.likeGreen,
  } as TextStyle,
  secondary: {
    ...BASE_TEXT,
    color: color.palette.grey4a,
  } as TextStyle,
  danger: {
    ...BASE_TEXT,
    color: color.palette.white,
  } as TextStyle,
  gradient: {
    ...BASE_TEXT,
    color: color.palette.likeGreen,
  },
  outlined: {
    ...BASE_TEXT,
    color: color.palette.lighterCyan,
  },
  "secondary-outlined": {
    ...BASE_TEXT,
    color: color.palette.grey4a,
  },
  link: {
    ...BASE_TEXT_LINK,
    color: color.palette.lighterCyan,
  } as TextStyle,
  "link-dark": {
    ...BASE_TEXT_LINK,
    color: color.palette.likeCyan,
  } as TextStyle,
  "link-plain": {
    ...BASE_TEXT_LINK,
    color: color.palette.grey9b,
  } as TextStyle,
  "button-group": {
    ...BASE_TEXT,
    paddingHorizontal: 0,
    paddingVertical: 0,
    color: color.palette.white,
    fontWeight: "400",
  } as TextStyle,
}

/**
 * A list of preset names.
 */
export type ButtonPreset = keyof typeof viewPresets
