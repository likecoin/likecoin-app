import { ViewProps } from "react-native"

import { SheetPresetType } from "./sheet.presets"

export interface SheetProps extends ViewProps {
  /**
   * Preset of the sheet
   */
  preset?: SheetPresetType
}
