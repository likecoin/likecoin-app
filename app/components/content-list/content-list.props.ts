import {
  SectionListData,
  ViewStyle,
} from "react-native"

import {
  ContentListItemStyleProps,
} from "../content-list-item"

import { Content } from "../../models/content"
import { Creator } from "../../models/creator"

export interface ContentListProps extends ContentListItemStyleProps {
  data?: Content[]

  /**
   * Set this to show content list in sections
   */
  sections?: SectionListData<Content>[]
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
  onToggleBookmark?: (url: string) => void
  onToggleFollow?: (content: Content) => void
  onPressUndoButton?: (content: Content) => void
  onFetchMore?: ((info?: { distanceFromEnd: number }) => void) | null
  onRefresh?: () => void

  /**
   * Rendered at the top of each section.
   */
  renderSectionHeader?: (info: { section: SectionListData<Content> }) => React.ReactElement | null

  style?: ViewStyle
}
