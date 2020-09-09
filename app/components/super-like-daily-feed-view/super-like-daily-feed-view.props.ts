import { ViewStyle } from "react-native"

import { Content } from "../../models/content";
import { Creator } from "../../models/creator";
import { SuperLike } from "../../models/super-like";
import { SuperLikeDailyFeed } from "../../models/super-like-daily-feed";

export interface SuperLikeDailyFeedViewProps {
  /**
   * The feed.
   */
  feed: SuperLikeDailyFeed

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle

  onPressItem?: (superLike: SuperLike) => void
  onToggleBookmark?: (content: Content) => void
  onToggleFollow?: (creator: Creator) => void
  onPressUndoUnfollowButton?: (creator: Creator) => void
}
