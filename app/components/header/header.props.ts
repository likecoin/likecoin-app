import { ViewStyle, TextStyle } from "react-native"
import { IconTypes } from "../icon"
import { Color } from "../../theme"

export interface HeaderProps {
  /**
   * Main header, e.g. POWERED BY BOWSER
   */
  headerTx?: string

  /**
   * header non-i18n
   */
  headerText?: string

  /**
   * Icon that should appear on the left
   */
  leftIcon?: IconTypes

  /**
   * Left icon color. Default is white.
   */
  leftIconColor?: Color | string

  /**
   * What happens when you press the left icon
   */
  onLeftPress?(): void

  /**
   * Custom view that should appear on the right
   */
  leftView?: React.ReactNode

  /**
   * Icon that should appear on the right
   */
  rightIcon?: IconTypes

  /**
   * Right icon color. Default is white.
   */
  rightIconColor?: Color | string

  /**
   * What happens when you press the right icon
   */
  onRightPress?(): void

  /**
   * Custom view that should appear on the right
   */
  rightView?: React.ReactNode

  /**
   * Container style overrides.
   */
  style?: ViewStyle

  /**
   * Title style overrides.
   */
  titleStyle?: TextStyle

  /**
   * Title view overrides.
   */
  children?: React.ReactNode
}
