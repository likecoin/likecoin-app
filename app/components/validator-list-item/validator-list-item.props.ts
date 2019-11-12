import { TouchableOpacityProps, ViewStyle } from "react-native"

export interface ValidatorListItemProps extends TouchableOpacityProps {
  /**
   * The icon in URL
   */
  icon?: string

  /**
   * The title text
   */
  title?: string

  /**
   * The subtitle text
   */
  subtitle?: string

  /**
   * The right title text
   */
  rightTitle?: string

  /**
   * The right subtitle text
   */
  rightSubtitle?: string

  /**
   * Turn dark mode on if set to `true`
   */
  isDarkMode?: boolean

  /**
   * An optional style override useful for margin.
   */
  style?: ViewStyle
}
