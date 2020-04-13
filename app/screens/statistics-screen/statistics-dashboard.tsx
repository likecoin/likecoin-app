import * as React from "react"
import { View } from "react-native"
import { observer } from "mobx-react"
import moment from "moment"

import {
  StatisticsDashbaordProps as Props,
} from "./statistics-dashboard.props"
import {
  StatisticsDashbaordStyle as Style,
} from "./statistics-dashboard.style"

import {
  StatisticsWeeklyChart,
  StatisticsWeeklyChartBarData,
} from "../../components/statistics-weekly-chart"
import {
  StatisticsDataGrid,
} from "../../components/statistics-data-grid"

import { translate } from "../../i18n"

@observer
export class StatisticsDashbaord extends React.Component<Props> {
  render() {
    const {
      weekData,
      index,
    } = this.props
    const {
      likeAmount = 0,
      worksCount = 0,
      creatorsCount = 0,
      days,
      startTs = 0,
    } = weekData || {}

    const chartData = days && days.map((day, weekday) => {
      const barData: StatisticsWeeklyChartBarData = {
        values: [day.totalLikeAmount],
        label: translate(`Week.${weekday}`),
      }
      // Highlight today
      if (index === 0 && weekday === moment().weekday()) {
        barData.isHighlighted = true
      }
      const { selectedWeekday } = this.props.dataStore
      if (selectedWeekday !== -1) {
        if (weekday === selectedWeekday) {
          barData.isFocused = true
        } else {
          barData.isDimmed = true
        }
      }
      return barData
    })

    let title: string
    if (index === 0) {
      title = translate("Statistics.Period.Week.This")
    } else if (index === 1) {
      title = translate("Statistics.Period.Week.Last")
    } else {
      title = weekData ? weekData.getPeriodText() : ""
    }

    return (
      <View
        key={startTs}
        style={Style.Root}
      >
        <StatisticsDataGrid
          items={[
            {
              preset: "block",
              title,
              titlePreset: "small-highlighted",
            },
            {
              title: `${likeAmount.toFixed(4)} LIKE`,
              titlePreset: "large-highlighted"
            },
            {
              preset: "right",
              title: `${worksCount}`,
              subtitle: translate("Statistics.Work", { count: worksCount }),
            },
            {
              preset: "right",
              title: `${creatorsCount}`,
              subtitle: translate("Statistics.Creator", { count: creatorsCount }),
            },
          ]}
          style={Style.DataGrid}
        />
        <View style={Style.Chart}>
          <StatisticsWeeklyChart
            data={chartData}
            onPressBar={this.props.onPressBarInChart}
          />
        </View>
      </View>
    )
  }
}
