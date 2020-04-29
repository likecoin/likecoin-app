import { StatisticsScreenProps } from "./statistics-screen.props"

import {
  StatisticsRewardedStore,
} from "../../models/statistics-store"

export interface StatisticsRewardedScreenProps extends StatisticsScreenProps {
  dataStore: StatisticsRewardedStore
}
