import { LayoutChangeEvent } from "react-native"
import { NavigationScreenProps } from "react-navigation"

export interface StatisticsScreenWrapperProps extends NavigationScreenProps {}

export interface StatisticsScreenProps extends StatisticsScreenWrapperProps {
  carouselWidth: number
  skeletonListItemKeyExtractor: (item: any, index: number) => string
  renderSeparator: React.ComponentType<any> | null
  onLayoutCarousel: (event: LayoutChangeEvent) => void
}
