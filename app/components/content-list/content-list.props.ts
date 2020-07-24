import {
  SectionListData,
  ViewStyle,
} from "react-native"

import {
  ContentListItemStyleProps,
} from "../content-list-item"

import { Content } from "../../models/content"
import { Creator } from "../../models/creator"
import {
  SuperLikedContent,
} from "../../models/super-liked-content"

export interface ContentListBaseProps extends ContentListItemStyleProps {
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

  onToggleBookmark?: (url: string) => void
  onToggleFollow?: (creator: Creator) => void
  onPressUndoUnfollowButton?: (creator: Creator) => void
  onFetchMore?: ((info?: { distanceFromEnd: number }) => void) | null
  onRefresh?: () => void

  style?: ViewStyle
}

export interface ContentListProps extends ContentListBaseProps {
  data?: Content[]

  /**
   * Set this to show content list in sections
   */
  sections?: SectionListData<Content>[]

  /**
   * Rendered at the top of each section.
   */
  renderSectionHeader?: (info: {
    section: SectionListData<Content>,
  }) => React.ReactElement | null

  onPressItem?: (url: string) => void
}

export interface SuperLikedContentListProps extends ContentListBaseProps {
  data?: SuperLikedContent[]

  /**
   * Set this to show content list in sections
   */
  sections?: SectionListData<SuperLikedContent>[]

  /**
   * Rendered at the top of each section.
   */
  renderSectionHeader?: (info: {
    section: SectionListData<SuperLikedContent>,
  }) => React.ReactElement | null

  onPressItem?: (superLike: SuperLikedContent) => void
}
