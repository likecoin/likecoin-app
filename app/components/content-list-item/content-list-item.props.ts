import { ViewStyle } from "react-native"

import { Content } from "../../models/content"
import { Creator } from "../../models/creator"
import { SuperLike } from "../../models/super-like"

export interface ContentListItemStyleProps {
  /**
   * The background color of the list item. Default is white.
   */
  backgroundColor?: string

  /**
   * The color of the underlay that will show through when the touch is active on the list item.
   */
  underlayColor?: string

  /**
   * The primary color of the skeleton for loading.
   */
  skeletonPrimaryColor?: string

  /**
   * The secondary color of the skeleton for loading.
   */
  skeletonSecondaryColor?: string
}

export interface ContentListItemBaseProps extends ContentListItemStyleProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle

  /**
   * A callback when the bookmark button is pressed.
   */
  onToggleBookmark?: (content: Content) => void

  /**
   * A callback when the follow button is pressed.
   */
  onToggleFollow?: (creator: Creator) => void

  /**
   * A callback when the more button is pressed.
   */
  onPressMoreButton?: () => void
}

export interface BookmarkedContentListItemProps extends ContentListItemBaseProps {
  item: Content

  /**
   * A callback when the item is pressed.
   */
  onPress?: (content: Content) => void

  /**
   * A callback when the undo remove bookmark button is pressed.
   */
  onPressUndoRemoveBookmarkButton?: (content: Content) => void
}

export interface SuperLikeContentListItemProps extends ContentListItemBaseProps {
  item: SuperLike

  /**
   * Set to true to show the follow toggle. Default is false.
   */
  isShowFollowToggle?: boolean

  /**
   * A callback when the item is pressed.
   */
  onPress?: (item: SuperLike) => void

  /**
   * A callback when the undo button is pressed.
   */
  onPressUndoUnfollowButton?: (creator: Creator) => void
}
