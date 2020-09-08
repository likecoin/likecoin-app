import { ViewStyle, TextStyle, TouchableOpacityProps } from "react-native"

import {
  ButtonPreset,
  ButtonSize,
} from "./button.presets"

import { IconTypes } from "../icon"
import { TextSize } from "../text/text.sizes"

import { Color } from "../../theme"

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
  color?: Color | string

  /**
   * An optional font size override for fast styling.
   */
  fontSize?: TextSize

  /**
   * An optional font weight override for fast styling.
   */
  weight?: TextStyle["fontWeight"]

  /**
   * One of the different types of text presets.
   */
  preset?: ButtonPreset

  /**
   * Size of buton
   */
  size?: ButtonSize

  /**
   * The children prepend to the button
   */
  prepend?: React.ReactElement

  /**
   * The children append to the button
   */
  append?: React.ReactElement

  /**
   * The URL that opens if it is clicked
   */
  link?: string

  /**
   * The name of the icon
   */
  icon?: IconTypes

  /**
   * Determine the component should hide or not
   */
  isHidden?: boolean

  /**
   * Show a loading animation if set to true
   */
  isLoading?: boolean

  /**
   * One of the different types of text presets.
   */
  children?: React.ReactNode
}
