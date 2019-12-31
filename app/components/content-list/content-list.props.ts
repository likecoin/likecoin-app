import { Content } from "../../models/content"

export interface ContentListProps {
  data: Content[]

  titleLabelTx: string
  isLoading?: boolean
  isFetchingMore?: boolean
  hasFetched?: boolean
  hasFetchedAll?: boolean
  lastFetched?: number

  onPressItem?: Function
  onFetchMore?: ((info?: { distanceFromEnd: number }) => void) | null
  onRefresh?: () => void
}
