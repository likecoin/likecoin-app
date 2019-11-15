import { SvgProps } from "react-native-svg"

import { IconTypes } from "./icons"
import { Color } from "../../theme"

export interface IconProps extends SvgProps {
  /**
   * An optional text color override for fast styling.
   */
  color?: Color

  /**
   * The name of the icon
   */
  name: IconTypes
}
