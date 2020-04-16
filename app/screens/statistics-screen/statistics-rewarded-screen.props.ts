import { NavigationScreenProps } from "react-navigation"

import {
  StatisticsRewardedStore,
} from "../../models/statistics-store"

export interface StatisticsRewardedScreenProps extends NavigationScreenProps {
  dataStore: StatisticsRewardedStore
}
