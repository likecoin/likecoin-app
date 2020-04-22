import {
  StatisticsDataGridStyle as Style
} from "./statistics-data-grid.style"

export const StatisticsDataGridItemPresets = {
  left: Style.ItemLeft,
  right: Style.ItemRight,
  block: Style.ItemBlock,
}

export type StatisticsDataGridItemPreset = keyof typeof StatisticsDataGridItemPresets

export const StatisticsDataGridItemTitlePresets = {
  large: Style.ItemTitleLarge,
  "large-highlighted": Style.ItemTitleLargeHighlighted,
  small: Style.ItemTitleSmall,
  "small-highlighted": Style.ItemTitleSmallHighlighted,
  "value-decrease": Style.ItemTitleValueDecrease,
  "value-increase": Style.ItemTitleValueIncrease,
}
export type StatisticsDataGridItemTitlePreset = keyof typeof StatisticsDataGridItemTitlePresets
