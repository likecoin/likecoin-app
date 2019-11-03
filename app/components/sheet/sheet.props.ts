import { ViewProps } from "react-native"

import { SheetPresetType } from "./sheet.presets"

export interface SheetProps extends ViewProps {
  /**
   * Preset of the sheet
   */
  preset?: SheetPresetType

  /**
   * Remove top padding if set to `true`, default is `false`
   */
  isZeroPaddingTop?: boolean | string

  /**
   * Remove bottom padding if set to `true`, default is `false`
   */
  isZeroPaddingBottom?: boolean | string
}
