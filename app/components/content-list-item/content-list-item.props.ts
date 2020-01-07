import { ViewStyle } from "react-native"

import { Content } from "../../models/content"

export interface ContentListItemProps {
  content: Content

  /**
   * Set to false to hide the bookmark icon. Default is true.
   */
  isShowBookmarkIcon?: boolean

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle

  /**
   * A callback when the item is pressed.
   */
  onPress?: (url: string) => void

  /**
   * A callback when the bookmark button is pressed.
   */
  onBookmark?: (url: string) => void
}
