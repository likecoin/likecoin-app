import { StatisticsScreenProps } from "./statistics-screen.props"

import {
  StatisticsSupportedStore,
} from "../../models/statistics-store"

export interface StatisticsSupportedScreenProps extends StatisticsScreenProps {
  dataStore: StatisticsSupportedStore
}
