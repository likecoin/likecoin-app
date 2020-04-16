import {
  StatisticsRewardedStore,
  StatisticsRewardedWeek,
} from "../../models/statistics-store"

export interface StatisticsRewardedDashbaordProps {
  index: number
  store: StatisticsRewardedStore
  week: StatisticsRewardedWeek
  onPressBarInChart: (index: number) => void
}
