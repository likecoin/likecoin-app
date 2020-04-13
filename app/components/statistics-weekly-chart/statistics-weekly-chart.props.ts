import { StyleProp, ViewStyle } from "react-native"
import {
  StatisticsChartLegendType,
} from "./statistics-chart-legend.props"

export interface StatisticsWeeklyChartBarConfig {
  label: string
  isMarked?: boolean
  isHighlighted?: boolean
  isFocused?: boolean
  isDimmed?: boolean
}

export interface StatisticsWeeklyChartBarData extends StatisticsWeeklyChartBarConfig {
  values: number[]
}

export interface StatisticsChartLegendData {
  type: StatisticsChartLegendType
  title: string
  subtitle: string
}

export interface StatisticsWeeklyChartProps {
  width?: number
  height?: number
  data?: StatisticsWeeklyChartBarData[]
  numGridLines?: number
  barRadius?: number
  barWidth?: number
  barInterspace?: number
  chartMarginTop?: number
  chartMarginBottom?: number
  chartPaddingTop?: number
  chartPaddingLeft?: number
  chartPaddingRight?: number
  strokeWidth?: number
  yUnit?: string
  legends?: StatisticsChartLegendData[]
  style?: StyleProp<ViewStyle>
  onPressBar?: (index: number) => void
}

export interface StatisticsWeeklyChartBarProps extends StatisticsWeeklyChartBarConfig {
  x: number
  y: number
  height: number
  filledHeight: number
}

export interface StatisticsWeeklyChartGridLineProps {
  y: number
  label: string
}
