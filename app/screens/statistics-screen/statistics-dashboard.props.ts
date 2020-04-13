import {
  StatisticsSupportedStore,
  StatisticsSupportedWeek,
} from "../../models/statistics-store"

export interface StatisticsDashbaordProps {
  dataStore: StatisticsSupportedStore
  weekData: StatisticsSupportedWeek
  index: number
  onPressBarInChart: (index: number) => void
}
