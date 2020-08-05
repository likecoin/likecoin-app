import * as React from "react"
import { View } from "react-native"
import { observer } from "mobx-react"
import moment from "moment"

import {
  StatisticsDashboardStyle as Style,
} from "./statistics-dashboard.style"
import {
  StatisticsSupportedDashbaordProps as Props,
} from "./statistics-supported-dashboard.props"

import {
  StatisticsDataGrid,
} from "../../components/statistics-data-grid"
import {
  StatisticsWeeklyChart,
  StatisticsWeeklyChartBarData,
} from "../../components/statistics-weekly-chart"
import {
  StatisticsSupportedDay,
} from "../../models/statistics-store"

import { translate } from "../../i18n"

@observer
export class StatisticsSupportedDashbaord extends React.Component<Props> {
  render() {
    const {
      index: weekIndex,
      store: {
        hasSelectedDayOfWeek,
        selectedDayOfWeek,
      },
      week: {
        likeAmount: weekLikeAmount,
        worksCount: weekWorksCount,
        creatorsCount: weekCreatorsCount,
        days = [] as StatisticsSupportedDay[],
        startTs = 0,
        getPeriodText = undefined,
      } = {},
    } = this.props

    const chartData: StatisticsWeeklyChartBarData[] = []
    days.forEach((day, dayOfWeek) => {
      const barData: StatisticsWeeklyChartBarData = {
        values: [day.totalLikeAmount],
        label: translate(`Week.${dayOfWeek}`),
      }
      // Highlight today
      if (weekIndex === 0 && dayOfWeek === moment().weekday()) {
        barData.isHighlighted = true
      }
      if (hasSelectedDayOfWeek) {
        if (dayOfWeek === selectedDayOfWeek) {
          barData.isFocused = true
        } else {
          barData.isDimmed = true
        }
      }
      chartData.push(barData)
    })

    let title: string
    if (weekIndex === 0) {
      title = translate("Statistics.Period.Week.This")
    } else if (weekIndex === 1) {
      title = translate("Statistics.Period.Week.Last")
    } else {
      title = getPeriodText ? getPeriodText() : ""
    }

    const likeAmount =
      (hasSelectedDayOfWeek
        ? days[selectedDayOfWeek]?.totalLikeAmount
        : weekLikeAmount) || 0

    const worksCount =
      (hasSelectedDayOfWeek
        ? days[selectedDayOfWeek]?.totalWorksCount
        : weekWorksCount) || 0

    const creatorsCount =
      (hasSelectedDayOfWeek
        ? days[selectedDayOfWeek]?.totalCreatorsCount
        : weekCreatorsCount) || 0

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
              titlePreset: hasSelectedDayOfWeek ? "small" : "small-highlighted",
            },
            {
              title: `${likeAmount.toFixed(4)} LIKE`,
              titlePreset: hasSelectedDayOfWeek ? "large" : "large-highlighted"
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
        <View style={Style.ChartWrapper}>
          <StatisticsWeeklyChart
            data={chartData}
            onPressBar={this.props.onPressBarInChart}
          />
        </View>
      </View>
    )
  }
}
