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

declare var module: any

storiesOf("StatisticsWeeklyChart", module)
  .addDecorator((fn: () => React.ReactNode) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behavior", () => {
    const simpleData: StatisticsWeeklyChartBarData[] = []
    for (let i = 0; i < 7; i++) {
      const value = Math.random() * 10
      simpleData.push({
        values: [value],
        label: value.toFixed(1),
      })
    }

    const stackedData: StatisticsWeeklyChartBarData[] = []
    let value1Sum = 0
    let value2Sum = 0
    simpleData.forEach(({ values: [value1] }, i) => {
      const value2 = Math.random() * 10
      value1Sum = value1Sum + value1
      value2Sum = value2Sum + value2
      const data: StatisticsWeeklyChartBarData = {
        values: [value1, value2],
        label: (value1 + value2).toFixed(1),
      }
      switch (i) {
        case 0:
          break
        case 1:
          data.isMarked = true
          break
        case 2:
          data.isFocused = true
          break
        case 3:
          data.isHighlighted = true
          break
        case 4:
          data.label = "Text"
          break
        default:
          data.isDimmed = true
      }
      stackedData.push(data)
    })

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
        <UseCase text="Basic Chart" usage="Basic bar chart with `values[]` and `label`">
          <StatisticsWeeklyChart data={simpleData} />
          <Text text={JSON.stringify({ data: [simpleData[0]] }, null, 2)} />
        </UseCase>
        <UseCase text="Stacked Chart with Legends" usage="Stacked bar chart with other props">
          <StatisticsWeeklyChart data={stackedData} legends={legends} />
          <Text text={JSON.stringify({ data: stackedData }, null, 2)} />
        </UseCase>
      </Story>
    )
  })
