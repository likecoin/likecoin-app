import * as React from "react"
import {
  Linking,
  View,
} from "react-native"
import { observer } from "mobx-react"
import moment from "moment"

import {
  StatisticsDashboardStyle as CommonStyle,
} from "./statistics-dashboard.style"
import {
  StatisticsRewardedDashboardStyle as Style,
} from "./statistics-rewarded-dashboard.style"
import {
  StatisticsRewardedDashboardProps as Props,
} from "./statistics-rewarded-dashboard.props"

import { Button } from "../../components/button"
import {
  StatisticsDataGrid,
  StatisticsDataGridItemProps,
} from "../../components/statistics-data-grid"
import {
  StatisticsChartLegendData,
  StatisticsWeeklyChart,
  StatisticsWeeklyChartBarData,
} from "../../components/statistics-weekly-chart"
import { Text } from "../../components/text"

import {
  StatisticsRewardedDay,
} from "../../models/statistics-store"

import { translate } from "../../i18n"
import {
  calcPercentDiff,
  withAbsPercent,
} from "../../utils/number"

@observer
export class StatisticsRewardedDashbaord extends React.Component<Props> {
  private onPressGetRewardsButton = () => {
    Linking.openURL("https://like.co/in/creator")
  }

  render() {
    const {
      index: weekIndex,
      store: {
        hasSelectedDayOfWeek,
        selectedDayOfWeek,
      },
      week: {
        days = [] as StatisticsRewardedDay[],
        likeAmount: weeklyLikeAmount,
        likeAmountFromCivicLikers: weeklyLikeAmountFromCivicLikers,
        likeAmountFromCreatorsFund: weeklyLikeAmountFromCreatorsFund,
        getPeriodText = undefined,
        isFetching = false,
      } = {},
    } = this.props

    const chartData: StatisticsWeeklyChartBarData[] = []
    days.forEach((day, dayOfWeek) => {
      const barData: StatisticsWeeklyChartBarData = {
        values: [
          day.totalCivicLikeAmount,
          day.totalBasicLikeAmount,
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

    const likeAmount =
      (hasSelectedDayOfWeek
        ? days[selectedDayOfWeek]?.totalLikeAmount
        : weeklyLikeAmount) || 0

    const likeAmountFromCivicLikers =
      (hasSelectedDayOfWeek
        ? days[selectedDayOfWeek]?.totalCivicLikeAmount
        : weeklyLikeAmountFromCivicLikers) || 0

    const likeAmountFromCreatorFunds =
      (hasSelectedDayOfWeek
        ? days[selectedDayOfWeek]?.totalBasicLikeAmount
        : weeklyLikeAmountFromCreatorsFund) || 0

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
        const growthPercentage = calcPercentDiff(weeklyLikeAmount, lastWeek.likeAmount || 0)
        if (growthPercentage !== 0) {
          dataItems.push({
            preset: "right",
            title: withAbsPercent(growthPercentage),
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

    const hasNoReward = weeklyLikeAmount === 0

    return (
      <View style={CommonStyle.Root}>
        <StatisticsDataGrid
          items={dataItems}
          style={CommonStyle.DataGrid}
        />
        <View style={CommonStyle.ChartWrapper}>
          <StatisticsWeeklyChart
            data={chartData}
            legends={legendsData}
            onPressBar={this.props.onPressBarInChart}
            chartStyle={hasNoReward ? Style.ChartDimmed : null}
          />
          {!isFetching && hasNoReward && (
            <View style={CommonStyle.ChartOverlay}>
              <Text
                tx="StatisticsRewardedScreen.Dashboard.Empty.Title"
                size="default"
                weight="500"
                color="likeCyan"
              />
              <Button
                tx="StatisticsRewardedScreen.Dashboard.Empty.ButtonTitle"
                style={Style.GetRewardsButton}
                onPress={this.onPressGetRewardsButton}
              />
            </View>
          )}
        </View>
      </View>
    )
  }
}
