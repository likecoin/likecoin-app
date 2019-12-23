import { ViewStyle } from "react-native"

export interface ContentListItemProps {
  /**
   * The URL of the content.
   */
  url: string

  /**
   * The title of the content.
   */
  title?: string

  /**
   * The URL of the thumbnail of the content.
   */
  thumbnailURL?: string

  /**
   * The display name of the creator of the content.
   */
  creatorName?: string

  /**
   * The count of likes of the content.
   */
  likeCount?: number

  /**
   * The number of likers that like the content.
   */
  likerCount?: number

  /**
   * Set to true if details has fetched.
   */
  hasFetchedDetails?: boolean

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle

  /**
   * A callback when the item is pressed.
   */
  onPress?: Function

  /**
   * A callback when details have to be fetched.
   */
  onFetchDetails?: Function

  /**
   * A callback when stats have to be fetched.
   */
  onFetchStat?: Function
}
