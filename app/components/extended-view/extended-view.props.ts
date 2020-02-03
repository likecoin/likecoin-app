import { ViewProps } from "react-native"

export interface ExtendedViewProps extends ViewProps {
  /**
   * Children components.
   */
  children?: React.ReactNode

  /**
   * An optional background color
   */
  backgroundColor?: string
}
