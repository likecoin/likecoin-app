import { ViewStyle } from "react-native"

export interface AuthcoreWidgetViewProps {
  baseURL: string,
  accessToken: string,
  company?: string,
  logo?: string
  internal?: boolean
  page?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
}
