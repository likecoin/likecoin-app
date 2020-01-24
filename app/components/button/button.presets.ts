import { ViewStyle, TextStyle } from "react-native"
import { color, spacing } from "../../theme"
import { sizes } from "../text/text.sizes"

/**
 * All text will start off looking like this.
 */
const BASE_VIEW: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
}

const BASE_BLOCK_VIEW: ViewStyle = {
  minHeight: 44,
  borderRadius: 12,
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[2],
}

const BASE_TEXT: TextStyle = {
  fontSize: sizes.medium,
  fontWeight: "bold",
}

/**
 * All the variations of text styling within the app.
 *
 * You want to customize these to whatever you need in your app.
 */
export const viewPresets = {
  /**
   * A plain style button
   */
  plain: {
    ...BASE_VIEW,
    ...BASE_BLOCK_VIEW,
  } as ViewStyle,

  /**
   * A smaller piece of secondard information.
   */
  primary: {
    ...BASE_VIEW,
    ...BASE_BLOCK_VIEW,
    backgroundColor: color.palette.lighterCyan,
  } as ViewStyle,

  /**
   * A outlined style button
   */
  outlined: {
    ...BASE_VIEW,
    ...BASE_BLOCK_VIEW,
    backgroundColor: "transparent",
    borderColor: color.palette.lighterCyan,
    borderWidth: 1,
  } as ViewStyle,

  /**
   * A button without extras.
   */
  link: {
    ...BASE_VIEW,
    alignItems: "flex-start",
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

export const textPresets = {
  primary: {
    ...BASE_TEXT,
    color: color.palette.likeGreen,
  } as TextStyle,
  outlined: {
    ...BASE_TEXT,
    color: color.palette.lighterCyan,
  },
  link: {
    ...BASE_TEXT,
    color: color.palette.lighterCyan,
    paddingHorizontal: 0,
    paddingVertical: 0,
    textDecorationLine: "underline",
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
export type ButtonPresetNames = keyof typeof viewPresets
