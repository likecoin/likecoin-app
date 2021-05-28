import { WithContentListHelperProps } from "./content-list.with-helper"

import { Content } from "../../models/content"
import { Creator } from "../../models/creator"
import { SuperLike } from "../../models/super-like"

export interface ContentListBaseProps extends WithContentListHelperProps {
  lastFetched?: number

  /**
   * Set to false to hide bookmark icons. Default is true.
   */
  isShowBookmarkIcon?: boolean

  /**
   * Set to true to show follow toggle. Default is false.
   */
  isShowFollowToggle?: boolean

  onToggleBookmark?: (content: Content) => void
  onToggleArchive?: (content: Content) => void
  onToggleFollow?: (creator: Creator) => void
  onPressUndoUnfollowButton?: (creator: Creator) => void
}

export interface BookmarkedContentListProps extends ContentListBaseProps {
  data?: Content[]

  onPressItem?: (content: Content) => void
}

export interface SuperLikeContentListProps extends ContentListBaseProps {
  data?: ReadonlyArray<SuperLike>

  /**
   * Translation key of the header text
   */
  headerTx?: string

  onPressItem?: (superLike: SuperLike) => void
}
