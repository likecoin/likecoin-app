import { ListViewProps, NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { NavigationStackScreenProps } from "react-navigation-stack"

import { Content } from "../../models/content"
import { Creator } from "../../models/creator"
import { SuperLike } from "../../models/super-like"

export interface ContentListScreenProps extends NavigationStackScreenProps {
  listViewProps?: Partial<ListViewProps>
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  onPressContentItem?: (content: Content) => void
  onPressSuperLikeItem?: (superLike: SuperLike) => void
  onToggleArchive?: (content: Content) => void
  onToggleBookmark?: (content: Content) => void
  onToggleFollow?: (creator: Creator) => void
  onPressUndoUnfollowButton?: (creator: Creator) => void
}
