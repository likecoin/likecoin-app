import * as React from "react"
import { Svg, Rect } from "react-native-svg"

import {
  StatisticsChartLegendProps as Props,
} from "./statistics-chart-legend.props"

export function StatisticsChartLegend(props: Props) {
  const {
    type,
    color,
    style,
  } = props

  const fillProps = React.useMemo(
    () => ({ fill: type === "filled" ? color : "none" }),
    [type, color]
  )

  return (
    <Svg viewBox="0 0 10 10" width={10} height={10} style={style}>
      <Rect
        {...fillProps}
        y={1}
        x={1}
        width={8}
        height={8}
        stroke={color}
        rx={2}
      />
    </Svg>
  )
}
