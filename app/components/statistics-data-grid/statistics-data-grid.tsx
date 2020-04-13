import * as React from "react"
import { View } from "react-native"

import {
  StatisticsDataGridProps as Props,
} from "./statistics-data-grid.props"
import {
  StatisticsDataGridStyle as Style,
} from "./statistics-data-grid.style"
import {
  StatisticsDataGridItemPresets as ItemPresets,
  StatisticsDataGridItemTitlePresets as ItemTitlePresets,
} from "./statistics-data-grid.presets"

import { Text } from "../text"

export function StatisticsDataGrid(props: Props) {
  const { items = [] } = props

  return (
    <View style={[props.style, Style.Root]}>
      {items.map((item, i) => {
        const {
          preset = "left",
          title = "",
          titlePreset = "large",
          subtitle,
        } = item
        const style = ItemPresets[preset]
        const titleStyle = ItemTitlePresets[titlePreset]
        return (
          <View key={i} style={style}>
            <Text
              text={title}
              style={titleStyle}
            />
            {!!subtitle && (
              <Text
                text={subtitle}
                style={Style.ItemSubtitle}
              />
            )}
          </View>
        )
      })}
    </View>
  )
}
