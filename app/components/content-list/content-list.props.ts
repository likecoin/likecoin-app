import { ViewStyle } from "react-native"

import { Content } from "../../models/content"
import { Creator } from "../../models/creator"

export interface ContentListProps {
  data: Content[]
  creators: Map<string, Creator>

  titleLabelTx?: string
  isLoading?: boolean
  isFetchingMore?: boolean
  hasFetched?: boolean
  hasFetchedAll?: boolean
  lastFetched?: number

  /**
   * Set to false to hide bookmark icons. Default is true.
   */
  isShowBookmarkIcon?: boolean

  onPressItem?: (url: string) => void
  onBookmarkItem?: (url: string) => void
  onPressMoreButton?: (content: Content) => void
  onPressUndoButton?: (content: Content) => void
  onFetchMore?: ((info?: { distanceFromEnd: number }) => void) | null
  onRefresh?: () => void

  style?: ViewStyle
}
