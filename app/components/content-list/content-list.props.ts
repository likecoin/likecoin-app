import { SectionListData, StyleProp, ViewStyle } from "react-native"

import { ContentListItemStyleProps } from "../content-list-item"

import { Content } from "../../models/content"
import { Creator } from "../../models/creator"
import { SuperLike } from "../../models/super-like"
import {
  WrapScrollViewShadowProps,
} from "../wrap-scrollview-shadow/wrap-scrollview-shadow.props"

export interface ContentListBaseProps extends ContentListItemStyleProps {
  creators?: Map<string, Creator>

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

  onToggleBookmark?: (content: Content) => void
  onToggleFollow?: (creator: Creator) => void
  onPressUndoUnfollowButton?: (creator: Creator) => void
  onFetchMore?: ((info?: { distanceFromEnd: number }) => void) | null
  onRefresh?: () => void

  /**
   * Called once when the scroll position gets within onEndReachedThreshold of the rendered content.
   */
  onEndReached?: ((info: { distanceFromEnd: number }) => void) | null;

  /**
   * How far from the end (in units of visible length of the list) the bottom edge of the
   * list must be from the end of the content to trigger the `onEndReached` callback.
   * Thus a value of 0.5 will trigger `onEndReached` when the end of the content is
   * within half the visible length of the list.
   */
  onEndReachedThreshold?: number | null;

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
