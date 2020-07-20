import { NavigationScreenProps } from "react-navigation"

import {
  ReaderStore,
} from "../../models/reader-store"
import { Creator } from "../../models/creator"

export interface ContentListScreenProps extends NavigationScreenProps {
  readerStore: ReaderStore
  onPressContentItem: (url: string) => void
  onToggleBookmark: (url: string) => void
  onToggleFollow: (creator: Creator) => void
  onPressUndoUnfollowButton: (creator: Creator) => void
}
