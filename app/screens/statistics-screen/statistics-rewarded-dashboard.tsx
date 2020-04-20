import * as React from "react"
import { View } from "react-native"
import { observer } from "mobx-react"
import moment from "moment"

import {
  StatisticsDashbaordStyle as Style,
} from "./statistics-dashboard.style"
import {
  StatisticsRewardedDashbaordProps as Props,
} from "./statistics-rewarded-dashboard.props"

import {
  StatisticsDataGrid,
  StatisticsDataGridItemProps,
} from "../../components/statistics-data-grid"
import {
  StatisticsChartLegendData,
  StatisticsWeeklyChart,
  StatisticsWeeklyChartBarData,
} from "../../components/statistics-weekly-chart"

import {
  StatisticsRewardedDay,
} from "../../models/statistics-store"

import { translate } from "../../i18n"
import { calcPercentDiff } from "../../utils/number"

@observer
export class StatisticsRewardedDashbaord extends React.Component<Props> {
  render() {
    const {
      index: weekIndex,
      store: {
        hasSelectedDayOfWeek,
        selectedDayOfWeek,
      },
      week: {
        days = [] as StatisticsRewardedDay[],
        likeAmount: weekLikeAmount = 0,
        likeAmountFromCivicLikers: weeklyLikeAmountFromCivicLikers = 0,
        likeAmountFromCreatorsFund: weeklyLikeAmountFromCreatorsFund = 0,
        getPeriodText = undefined,
      } = {},
    } = this.props

    const chartData: StatisticsWeeklyChartBarData[] = []
    days.forEach((day, dayOfWeek) => {
      const barData: StatisticsWeeklyChartBarData = {
        values: [
          day.totalBasicLikeAmount,
          day.totalCivicLikeAmount,
        ],
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

    const likeAmount = hasSelectedDayOfWeek
      ? days[selectedDayOfWeek].totalLikeAmount
      : weekLikeAmount

    const likeAmountFromCivicLikers = hasSelectedDayOfWeek
      ? days[selectedDayOfWeek].totalCivicLikeAmount
      : weeklyLikeAmountFromCivicLikers

    const likeAmountFromCreatorFunds = hasSelectedDayOfWeek
      ? days[selectedDayOfWeek].totalBasicLikeAmount
      : weeklyLikeAmountFromCreatorsFund

    const dataItems: StatisticsDataGridItemProps[] = [
      {
        preset: "block",
        title,
        titlePreset: hasSelectedDayOfWeek ? "small" : "small-highlighted",
      },
      {
        title: `${likeAmount.toFixed(4)} LIKE`,
        titlePreset: hasSelectedDayOfWeek ? "large" : "large-highlighted",
        subtitle: " ", // XXX: For spacing
      },
    ]
    if (!hasSelectedDayOfWeek) {
      const lastWeek = this.props.store.getWeekByIndex(weekIndex + 1)
      if (lastWeek) {
        const growthPercentage = calcPercentDiff(weekLikeAmount, lastWeek.likeAmount || 0)
        if (growthPercentage !== 0) {
          dataItems.push({
            preset: "right",
            title: `${Math.abs(growthPercentage)}%`,
            titlePreset: growthPercentage > 0 ? "value-increase" : "value-decrease",
            subtitle: translate("Statistics.Period.Week.Previous"),
          })
        }
      }
    }

    const legendsData: StatisticsChartLegendData[] = [
      {
        type: "filled",
        title: `${likeAmountFromCivicLikers.toFixed(4)} LIKE`,
        subtitle: translate("StatisticsRewardedScreen.Dashboard.Legends.CivicLiker"),
      },
      {
        type: "outlined",
        title: `${likeAmountFromCreatorFunds.toFixed(4)} LIKE`,
        subtitle: translate("StatisticsRewardedScreen.Dashboard.Legends.CreatorFunds"),
      },
    ]

    return (
      <View style={Style.Root}>
        <StatisticsDataGrid
          items={dataItems}
          style={Style.DataGrid}
        />
        <View style={Style.Chart}>
          <StatisticsWeeklyChart
            data={chartData}
            legends={legendsData}
            onPressBar={this.props.onPressBarInChart}
          />
        </View>
      </View>
    )
  }
}
