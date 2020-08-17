import { SectionListData, StyleProp, ViewStyle } from "react-native"

import { ContentListItemStyleProps } from "../content-list-item"

import { Content } from "../../models/content"
import { Creator } from "../../models/creator"
import { SuperLike } from "../../models/super-like"
import {
  WrapScrollViewShadowProps,
} from "../wrap-scrollview-shadow/wrap-scrollview-shadow.props"

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

  /**
   * Set to true to show follow toggle. Default is false.
   */
  isShowFollowToggle?: boolean

  onToggleBookmark?: (url: string) => void
  onToggleFollow?: (creator: Creator) => void
  onPressUndoUnfollowButton?: (creator: Creator) => void
  onFetchMore?: ((info?: { distanceFromEnd: number }) => void) | null
  onRefresh?: () => void

  style?: StyleProp<ViewStyle>
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
    section: SectionListData<Content>
  }) => React.ReactElement | null

  onPressItem?: (url: string) => void
}

export interface SuperLikedContentListProps
  extends ContentListBaseProps,
    WrapScrollViewShadowProps {
  data?: ReadonlyArray<SuperLike>

  /**
   * Set this to show content list in sections
   */
  sections?: SectionListData<SuperLike>[]

  /**
   * Rendered at the top of each section.
   */
  renderSectionHeader?: (info: {
    section: SectionListData<SuperLike>
  }) => React.ReactElement | null

  onPressItem?: (superLike: SuperLike) => void
}
