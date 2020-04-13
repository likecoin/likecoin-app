import { ViewStyle } from "react-native"

export type StatisticsChartLegendType = "filled" | "outlined"

export interface StatisticsChartLegendProps {
  type: StatisticsChartLegendType
  color: string
  style?: ViewStyle
}
