import {
  StatisticsRewardedStore,
  StatisticsRewardedWeek,
} from "../../models/statistics-store"

export interface StatisticsRewardedDashboardProps {
  index: number
  store: StatisticsRewardedStore
  week: StatisticsRewardedWeek
  onPressBarInChart: (index: number) => void
  onPressGetRewardsButton?: () => void
}
