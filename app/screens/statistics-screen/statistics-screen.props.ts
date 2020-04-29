import { LayoutChangeEvent } from "react-native"
import { NavigationScreenProps } from "react-navigation"

import {
  StatisticsStore,
} from "../../models/statistics-store/statistics-store"

export interface StatisticsScreenWrapperProps extends NavigationScreenProps {
  dataStore: StatisticsStore
}

export interface StatisticsScreenProps extends StatisticsScreenWrapperProps {
  carouselWidth: number
  skeletonListItemKeyExtractor: (item: any, index: number) => string
  renderSeparator: React.ComponentType<any> | null
  onLayoutCarousel: (event: LayoutChangeEvent) => void
  onScrollDashboard: () => void
  onSelectDay: (dayIndex: number) => void
}
