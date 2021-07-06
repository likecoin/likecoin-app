import {
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from "react-native"
import { NavigationStackScreenProps } from "react-navigation-stack"

import {
  StatisticsStore,
} from "../../models/statistics-store/statistics-store"

export interface StatisticsScreenWrapperProps extends NavigationStackScreenProps {
  dataStore: StatisticsStore
}

export interface StatisticsScreenProps extends StatisticsScreenWrapperProps {
  carouselWidth: number
  skeletonListItemKeyExtractor: (item: any, index: number) => string
  renderSeparator: React.ComponentType<any> | null
  onLayoutCarousel: (event: LayoutChangeEvent) => void
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  onScrollDashboard: () => void
  onSelectDay: (dayIndex: number) => void
}
