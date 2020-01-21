import { TextStyle, TextProps as TextProperties } from "react-native"
import { TextPresets } from "./text.presets"
import { TextSize } from "./text.sizes"
import { Color } from "../../theme"

export interface TextProps extends TextProperties {
  /**
   * A prepended element.
   */
  prepend?: React.ReactElement

  /**
   * Children components.
   */
  children?: React.ReactNode

  /**
   * Text which is looked up via i18n.
   */
  tx?: string

  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: object

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * One of the different types of text presets.
   */
  preset?: TextPresets

  /**
   * An optional text color override for fast styling.
   */
  color?: Color

  /**
   * An optional font size override for fast styling.
   */
  size?: TextSize

  /**
   * An optional font weight override for fast styling.
   */
  weight?: TextStyle["fontWeight"]

  /**
   * An optional text align override for fast styling.
   */
  align?: TextStyle["textAlign"]

  /**
   * Set to `true` to display in disabled style.
   */
  disabled?: boolean

  /**
   * Determine the component should hide or not
   */
  isHidden?: boolean

  /**
   * An optional style override useful for padding & margin.
   */
  style?: TextStyle | TextStyle[]
}
