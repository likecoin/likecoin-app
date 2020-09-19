import { NavigationScreenProps } from "react-navigation"

import { Content } from "../../models/content"
import { Creator } from "../../models/creator"
import { ReaderStore } from "../../models/reader-store"
import { SuperLike } from "../../models/super-like"

export interface ContentListScreenProps extends NavigationScreenProps {
  readerStore?: ReaderStore
  onPressContentItem?: (content: Content) => void
  onPressSuperLikeItem?: (superLike: SuperLike) => void
  onToggleBookmark?: (content: Content) => void
  onToggleFollow?: (creator: Creator) => void
  onPressUndoUnfollowButton?: (creator: Creator) => void
}
