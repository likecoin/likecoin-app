import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  SectionListData,
  StyleProp,
  ViewStyle,
} from "react-native"

import { ContentListItemStyleProps } from "../content-list-item"

import { Content } from "../../models/content"
import { Creator } from "../../models/creator"
import { SuperLike } from "../../models/super-like"

export interface ContentListBaseProps extends ContentListItemStyleProps {
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

  onToggleBookmark?: (content: Content) => void
  onToggleArchive?: (content: Content) => void
  onToggleFollow?: (creator: Creator) => void
  onPressUndoUnfollowButton?: (creator: Creator) => void
  onFetchMore?: ((info?: { distanceFromEnd: number }) => void) | null
  onRefresh?: () => void

  /**
   * Fires at most once per frame during scrolling.
   * The frequency of the events can be contolled using the scrollEventThrottle prop.
   */
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void

  /**
   * Called once when the scroll position gets within onEndReachedThreshold of the rendered content.
   */
  onEndReached?: ((info: { distanceFromEnd: number }) => void) | null

  /**
   * How far from the end (in units of visible length of the list) the bottom edge of the
   * list must be from the end of the content to trigger the `onEndReached` callback.
   * Thus a value of 0.5 will trigger `onEndReached` when the end of the content is
   * within half the visible length of the list.
   */
  onEndReachedThreshold?: number | null

  style?: StyleProp<ViewStyle>
}

export interface BookmarkedContentListProps extends ContentListBaseProps {
  data?: Content[]

  /**
   * Rendered at the top of each section.
   */
  renderSectionHeader?: (info: {
    section: SectionListData<Content>
  }) => React.ReactElement | null

  onPressItem?: (content: Content) => void
}

export interface SuperLikeContentListProps extends ContentListBaseProps {
  data?: ReadonlyArray<SuperLike>

  /**
   * Rendered at the top of each section.
   */
  renderSectionHeader?: (info: {
    section: SectionListData<SuperLike>
  }) => React.ReactElement | null

  onPressItem?: (superLike: SuperLike) => void
}
