import { ViewStyle } from "react-native"

import { color } from "../../theme"

/**
 * Base view
 */
const BASE_VIEW: ViewStyle = {
  borderRadius: 14,
  backgroundColor: color.palette.white,
  overflow: "hidden",
}

/**
 * All the variations of sheet.
 */
export const presets = {
  /**
   * Flat style sheet, no elevation and shadow
   */
  flat: {
    ...BASE_VIEW,
  } as ViewStyle,

  /**
   * A raised style sheet
   */
  raised: {
    ...BASE_VIEW,
    shadowColor: color.palette.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  } as ViewStyle,
}

/**
 * A list of preset type.
 */
export type SheetPresetType = keyof typeof presets
