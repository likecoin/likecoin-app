import {
  StatisticsSupportedStore,
  StatisticsSupportedWeek,
} from "../../models/statistics-store"

export interface StatisticsSupportedDashboardProps {
  index: number
  store: StatisticsSupportedStore
  week: StatisticsSupportedWeek
  onPressBarInChart: (index: number) => void
}
