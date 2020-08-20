import { NavigationScreenProps } from "react-navigation"

import { Creator } from "../../models/creator"
import { ReaderStore } from "../../models/reader-store"
import { SuperLike } from "../../models/super-like"

export interface ContentListScreenProps extends NavigationScreenProps {
  readerStore?: ReaderStore
  onPressContentItem?: (url: string) => void
  onPressSuperLikeItem?: (superLike: SuperLike) => void
  onToggleBookmark?: (url: string) => void
  onToggleFollow?: (creator: Creator) => void
  onPressUndoUnfollowButton?: (creator: Creator) => void
}
