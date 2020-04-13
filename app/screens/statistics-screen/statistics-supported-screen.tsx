import * as React from "react"
import {
  ListRenderItem,
  View,
  Dimensions,
} from "react-native"
import { FlatList } from "react-navigation"
import { observer, inject } from "mobx-react"
import Carousel from "react-native-snap-carousel"

import {
  StatisticsSupportedScreenProps as Props,
} from "./statistics-supported-screen.props"
import {
  StatisticsSupportedScreenStyle as Style,
} from "./statistics-supported-screen.style"
import { StatisticsDashbaord } from "./statistics-dashboard"
import {
  StatisticsSupportedListItem,
} from "./statistics-supported-list-item"

import { Header } from "../../components/header"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"

import {
  StatisticsSupportedCreator,
  StatisticsSupportedStore,
  StatisticsSupportedWeek,
} from "../../models/statistics-store"

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
    this.props.dataStore.fetchLatest({
      shouldFetchLastWeek: true,
    })
  }

  private listItemKeyExtractor = (item: StatisticsSupportedCreator) => item.likerID

  onBeforeSnapToWeek = (weekIndex: number) => {
    this.props.dataStore.selectWeek(weekIndex)
  }

  onScrollDashboard = () => {
    if (this.props.dataStore.hasSelectedWeekday) {
      this.props.dataStore.deselectWeekday()
    }
  }

  onPressBarInChart = (weekday: number) => {
    this.props.dataStore.selectWeekday(weekday)
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
            onScroll={this.onScrollDashboard}
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
    return (
      <StatisticsDashbaord
        dataStore={this.props.dataStore}
        weekData={weekData}
        index={index}
        onPressBarInChart={this.onPressBarInChart}
      />
    )
  }

  private renderSeparator = () => <View style={Style.Separator} />

  private renderSupportedCreator: ListRenderItem<StatisticsSupportedCreator> = ({ item }) => (
    <StatisticsSupportedListItem creator={item} />
  )
}
