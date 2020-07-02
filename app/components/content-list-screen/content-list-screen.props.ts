import { NavigationScreenProps } from "react-navigation"

import {
  ReaderStore,
} from "../../models/reader-store"
import { Content } from "../../models/content"

export interface ContentListScreenProps extends NavigationScreenProps {
  readerStore: ReaderStore
  onPressContentItem: (url: string) => void
  onToggleBookmark: (url: string) => void
  onToggleFollow: (content: Content) => void
  onPressUndoButton: (content: Content) => void
}
