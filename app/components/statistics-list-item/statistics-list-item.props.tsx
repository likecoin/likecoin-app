export type StatisticsListItemType =
  "rewarded-content" |
  "rewarded-daily-content" |
  "supported-creator" |
  "supported-content"

export interface StatisticsListItemProps {
  type: StatisticsListItemType

  title?: string
  subtitle?: string

  likeAmount?: string
  likeCount?: number
  numOfWorks?: number
  numOfLiker?: number
  numOfCivicLiker?: number

  avatarURL?: string
  isCivicLiker?: boolean

  isSkeleton?: boolean

  onPress?: () => void
}
