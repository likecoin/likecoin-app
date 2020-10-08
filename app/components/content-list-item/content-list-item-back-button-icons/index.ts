import { ArchiveIcon } from "./archive"
import { BookmarkIcon } from "./bookmark"
import { FollowIcon } from "./follow"
import { UnarchiveIcon } from "./unarchive"
import { UnbookmarkIcon } from "./unbookmark"
import { UnfollowIcon } from "./unfollow"

export const backButtonIcons = {
  archive: ArchiveIcon,
  bookmark: BookmarkIcon,
  follow: FollowIcon,
  unarchive: UnarchiveIcon,
  unbookmark: UnbookmarkIcon,
  unfollow: UnfollowIcon,
}

export type ContentListItemBackButtonIconType = keyof typeof backButtonIcons
