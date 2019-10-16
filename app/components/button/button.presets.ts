import { ViewStyle, TextStyle } from "react-native"
import { color, spacing } from "../../theme"
import { sizes } from "../text/text.sizes"

/**
 * All text will start off looking like this.
 */
const BASE_VIEW: ViewStyle = {
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[2],
  borderRadius: 12,
  flexDirection: "row",
  alignItems: "center",
}

const BASE_TEXT: TextStyle = {
  paddingHorizontal: spacing[3],
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
  } as ViewStyle,

  /**
   * A smaller piece of secondard information.
   */
  primary: {
    ...BASE_VIEW,
    backgroundColor: color.palette.lighterCyan,
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
   * A button without extras.
   */
  link: {
    ...BASE_VIEW,
    paddingHorizontal: spacing[0],
    padding: spacing[0],
    paddingVertical: 0,
    alignItems: "flex-start",
  } as ViewStyle,

  /**
   * A icon button.
   */
  icon: {
    ...BASE_VIEW,
    padding: spacing[1],
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
}

/**
 * A list of preset names.
 */
export type ButtonPresetNames = keyof typeof viewPresets
