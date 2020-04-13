import * as React from "react"
import {
  ListRenderItem,
  View,
  Dimensions,
} from "react-native"
import { FlatList } from "react-navigation"
import { observer, inject } from "mobx-react"
import Carousel from "react-native-snap-carousel"
import moment from "moment"

import {
  StatisticsSupportedScreenProps as Props,
} from "./statistics-supported-screen.props"
import {
  StatisticsSupportedScreenStyle as Style,
} from "./statistics-supported-screen.style"
import {
  StatisticsSupportedListItem,
} from "./statistics-supported-list-item"

import { Header } from "../../components/header"
import {
  StatisticsDataGrid,
} from "../../components/statistics-data-grid"
import {
  StatisticsWeeklyChart,
  StatisticsWeeklyChartBarData,
} from "../../components/statistics-weekly-chart"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"

import {
  StatisticsSupportedCreator,
  StatisticsSupportedStore,
  StatisticsSupportedWeek,
} from "../../models/statistics-store"

import { translate } from "../../i18n"
import { color } from "../../theme"

@inject(allStores => ({
  dataStore: (allStores as any).statisticsSupportedStore as StatisticsSupportedStore,
}))
@observer
export class StatisticsSupportedScreen extends React.Component<Props> {
  private onPressHeaderLeft = () => {
    this.props.navigation.goBack()
  }

  componentDidMount() {
    this.props.dataStore.fetchLatest()
  }

  private listItemKeyExtractor = (item: StatisticsSupportedCreator) => item.likerID

  onBeforeSnapToWeek = (weekIndex: number) => {
    this.props.dataStore.selectWeek(weekIndex)
  }

  render () {
    const week = this.props.dataStore.selectedWeek
    const supportedCreators = week && week.hasFetched ? week.creators : []
    const sliderWidth = Dimensions.get("window").width
    return (
      <Screen
        preset="fixed"
        backgroundColor={color.transparent}
        style={Style.Screen}
      >
        <View style={Style.BackdropWrapper}>
          <View style={Style.Backdrop} />
        </View>
        <Header
          headerTx="StatisticsSupportedScreen.Title"
          leftIcon="back"
          onLeftPress={this.onPressHeaderLeft}
        />
        <View style={Style.Carousel}>
          <Carousel<StatisticsSupportedWeek>
            data={this.props.dataStore.weeks}
            renderItem={this.renderDashboard}
            itemWidth={sliderWidth}
            sliderWidth={sliderWidth}
            onBeforeSnapToItem={this.onBeforeSnapToWeek}
          />
        </View>
        <Text
          tx="StatisticsSupportedScreen.ListTitle"
          style={Style.ListHeaderText}
        />
        <FlatList<StatisticsSupportedCreator>
          key={week ? week.startTs : null}
          data={supportedCreators}
          keyExtractor={this.listItemKeyExtractor}
          scrollEnabled={supportedCreators.length > 0}
          renderItem={this.renderSupportedCreator}
          ItemSeparatorComponent={this.renderSeparator}
          style={Style.List}
        />
      </Screen>
    )
  }

  private renderDashboard = ({ item: weekData, index }: {
    item: StatisticsSupportedWeek
    index: number
  }) => {
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
        style={Style.Dashboard}
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
          <StatisticsWeeklyChart data={chartData} />
        </View>
      </View>
    )
  }

  private renderSeparator = () => <View style={Style.Separator} />

  private renderSupportedCreator: ListRenderItem<StatisticsSupportedCreator> = ({ item }) => (
    <StatisticsSupportedListItem creator={item} />
  )
}
