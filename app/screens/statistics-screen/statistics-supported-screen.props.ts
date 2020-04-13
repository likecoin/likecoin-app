import { NavigationScreenProps } from "react-navigation"

import {
  StatisticsSupportedStore,
} from "../../models/statistics-store"

export interface StatisticsSupportedScreenProps extends NavigationScreenProps {
  dataStore: StatisticsSupportedStore
}
