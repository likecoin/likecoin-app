import * as React from "react"
import { storiesOf } from "@storybook/react-native"

import {
  StatisticsWeeklyChart,
} from "./statistics-weekly-chart"
import {
  StatisticsChartLegendData, StatisticsWeeklyChartBarData,
} from "./statistics-weekly-chart.props"

import { Text } from "../text"

import { StoryScreen, Story, UseCase } from "../../../storybook/views"

declare let module: any

storiesOf("StatisticsWeeklyChart", module)
  .addDecorator((fn: () => React.ReactNode) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behavior", () => {
    const chartData: StatisticsWeeklyChartBarData[] = []
    let value1Sum = 0
    let value2Sum = 0
    for (let i = 0; i < 7; i++) {
      const value1 = i * 5
      const value2 = i * 10
      const data: StatisticsWeeklyChartBarData = {
        values: [value1, value2],
        label: (value1 + value2).toFixed(1),
      }
      switch (i) {
        case 0:
          data.isDimmed = true
          break
        case 1:
          data.values = [1, 0]
          data.label = "1.0"
          break
        case 2:
          data.isMarked = true
          break
        case 3:
          data.isFocused = true
          break
        case 4:
          data.isHighlighted = true
          break
        case 5:
          data.label = "Text"
          data.isDimmed = true
          break
        case 6:
          data.values[0] += data.values[1]
          data.values[1] = 0
          break
        default:
      }
      value1Sum += data.values[0]
      value2Sum += data.values[1]
      chartData.push(data)
    }

    const legends: StatisticsChartLegendData[] = [
      {
        type: "filled",
        title: value1Sum.toFixed(2),
        subtitle: "filled",
      },
      {
        type: "outlined",
        title: value2Sum.toFixed(2),
        subtitle: "outlined",
      },
    ]

    return (
      <Story>
        <UseCase text="Empty Chart" usage="No props are passed">
          <StatisticsWeeklyChart />
        </UseCase>
        <UseCase text="Stacked Chart with Legends" usage="Stacked bar chart with other props">
          <StatisticsWeeklyChart data={chartData} legends={legends} />
          <Text text={JSON.stringify({ data: chartData }, null, 2)} />
        </UseCase>
      </Story>
    )
  })
