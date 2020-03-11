export interface ContentListItemBackProps {
  isBookmarked?: boolean
  isFollowingCreator?: boolean
  isShowFollowToggle?: boolean
  onToggleBookmark?: () => void
  onToggleFollow?: () => void
}