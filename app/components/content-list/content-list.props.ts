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

  onPressItem?: (url: string) => void
  onBookmarkItem?: (url: string) => void
  onFetchMore?: ((info?: { distanceFromEnd: number }) => void) | null
  onRefresh?: () => void

  style?: ViewStyle
}
