import {
  StatisticsSupportedStore,
  StatisticsSupportedWeek,
} from "../../models/statistics-store"

export interface StatisticsSupportedDashbaordProps {
  index: number
  store: StatisticsSupportedStore
  week: StatisticsSupportedWeek
  onPressBarInChart: (index: number) => void
}
