import { NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { NavigationScreenProps } from "react-navigation"

import { Content } from "../../models/content"
import { Creator } from "../../models/creator"
import { SuperLike } from "../../models/super-like"

export interface ContentListScreenProps extends NavigationScreenProps {
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  onPressContentItem?: (content: Content) => void
  onPressSuperLikeItem?: (superLike: SuperLike) => void
  onToggleArchive?: (content: Content) => void
  onToggleBookmark?: (content: Content) => void
  onToggleFollow?: (creator: Creator) => void
  onPressUndoUnfollowButton?: (creator: Creator) => void
}
