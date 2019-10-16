import { ReactNode } from "react"
import { ViewStyle } from "react-native"

export interface ValidatorScreenGridItemProps {
  /**
   * Children components.
   */
  children?: ReactNode

  /**
   * The text to display or nested components.
   */
  value?: string

  /**
   * The label which is looked up via i18n.
   */
  labelTx?: string

  /**
   * Determine span half of the width
   */
  isHalf?: boolean | string

  /**
   * Determine sepearator is shown or not
   */
  isShowSeparator?: boolean | string

  /**
   * Determine label is on top or not
   */
  isTopLabel?: boolean | string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle

  /**
   * An optional style override inner container.
   */
  innerStyle?: ViewStyle
}
