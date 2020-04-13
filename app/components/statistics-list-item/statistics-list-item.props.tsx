export type StatisticsListItemType =
  "rewards" | "support" | "rewards-daily" | "support-daily"

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
}
