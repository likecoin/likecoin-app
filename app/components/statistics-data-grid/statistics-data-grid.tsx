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

import { Icon } from "../icon"
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
              prepend={(
                titlePreset === "value-increase" || titlePreset === "value-decrease"
                  ? (
                    <Icon
                      width={12}
                      height={12}
                      name={(
                        titlePreset === "value-increase"
                          ? "arrow-increase"
                          : "arrow-decrease"
                      )}
                      fill={titleStyle.color as string}
                    />
                  )
                  : null
              )}
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
