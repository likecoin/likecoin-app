import {
  StyleProp,
  ViewStyle,
} from "react-native"

import {
  StatisticsDataGridItemPreset as ItemPreset,
  StatisticsDataGridItemTitlePreset as ItemTitlePreset,
} from "./statistics-data-grid.presets"

export interface StatisticsDataGridItemProps {
  preset?: ItemPreset,
  title: string
  titlePreset?: ItemTitlePreset,
  subtitle?: string
}

export interface StatisticsDataGridProps {
  items?: StatisticsDataGridItemProps[]
  style?: StyleProp<ViewStyle>
}
