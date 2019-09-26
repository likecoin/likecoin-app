import { ViewStyle, TextStyle, TouchableOpacityProps } from "react-native"
import { ButtonPresetNames } from "./button.presets"
import { Color } from "../../theme"
import { TextSize } from "../text/text.sizes"

export interface ButtonProps extends TouchableOpacityProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: string

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle | ViewStyle[]

  /**
   * An optional style override useful for the button text.
   */
  textStyle?: TextStyle | TextStyle[]

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
   * One of the different types of text presets.
   */
  preset?: ButtonPresetNames

  /**
   * One of the different types of text presets.
   */
  children?: React.ReactNode
}
