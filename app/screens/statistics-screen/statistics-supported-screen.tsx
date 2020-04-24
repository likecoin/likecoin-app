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
  StatisticsScreenStyle as Style,
} from "./statistics-screen.style"
import {
  StatisticsSupportedScreenProps as Props,
} from "./statistics-supported-screen.props"
import {
  StatisticsSupportedContentListItem,
} from "./statistics-supported-content-list-item"
import {
  StatisticsSupportedCreatorListItem,
} from "./statistics-supported-creator-list-item"
import {
  StatisticsSupportedDashbaord,
} from "./statistics-supported-dashboard"

import { Header } from "../../components/header"
import { Screen } from "../../components/screen"
import {
  StatisticsListItemSkeleton,
} from "../../components/statistics-list-item"
import { Text } from "../../components/text"

import {
  StatisticsSupportedContent,
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
    const { selectedWeek } = this.props.dataStore
    if (selectedWeek) {
      // Fetch this week data if necessary
      if (!selectedWeek.getIsJustFetched()) {
        selectedWeek.fetchData()
      }
      // Fetch previous week data if necessary
      this.props.dataStore.fetchWeek(selectedWeek.getPreviousWeekStartDate(), {
        skipIfFetched: true
      })
    } else {
      this.props.dataStore.fetchLatest({
        shouldFetchLastWeek: true,
      })
    }
  }

  private creatorListItemKeyExtractor =
    (item: StatisticsSupportedCreator) => item.likerID

  private contentListItemKeyExtractor =
    (item: StatisticsSupportedContent) => item.id

  private contentListItemSkeletonKeyExtractor =
    (_: any, index: number) => `${index}`

  onBeforeSnapToWeek = (weekIndex: number) => {
    this.props.dataStore.selectWeek(weekIndex)
  }

  onScrollDashboard = () => {
    if (this.props.dataStore.hasSelectedDayOfWeek) {
      this.props.dataStore.deselectDayOfWeek()
    }
  }

  onPressBarInChart = (dayOfWeek: number) => {
    this.props.dataStore.selectDayOfWeek(dayOfWeek)
  }

  render () {
    const {
      selectedWeek,
      hasSelectedDayOfWeek,
    } = this.props.dataStore
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
            data={this.props.dataStore.weekList}
            renderItem={this.renderDashboard}
            itemWidth={sliderWidth}
            sliderWidth={sliderWidth}
            onBeforeSnapToItem={this.onBeforeSnapToWeek}
            onScroll={this.onScrollDashboard}
          />
        </View>
        {selectedWeek && hasSelectedDayOfWeek ? (
          this.renderSupportedContentList(selectedWeek)
        ) : (
          this.renderSupportedCreatorList(selectedWeek)
        )}
      </Screen>
    )
  }

  private renderDashboard = ({ item: weekData, index }: {
    item: StatisticsSupportedWeek
    index: number
  }) => {
    return (
      <StatisticsSupportedDashbaord
        store={this.props.dataStore}
        week={weekData}
        index={index}
        onPressBarInChart={this.onPressBarInChart}
      />
    )
  }

  private renderSupportedCreatorList(week: StatisticsSupportedWeek) {
    const supportedCreators = week && week.hasFetched ? week.creators : []
    return (
      <React.Fragment>
        <Text
          tx="StatisticsSupportedScreen.ListTitle.Creator"
          style={Style.ListHeaderText}
        />
        {week.isFetching ? (
          <FlatList
            data={new Array(3)}
            scrollEnabled={false}
            keyExtractor={this.contentListItemSkeletonKeyExtractor}
            renderItem={this.renderSupportedCreatorListItemSkeleton}
            ItemSeparatorComponent={this.renderSeparator}
            style={Style.List}
          />
        ) : (
          <FlatList<StatisticsSupportedCreator>
            key={week ? week.startTs : null}
            data={supportedCreators}
            keyExtractor={this.creatorListItemKeyExtractor}
            renderItem={this.renderSupportedCreatorListItem}
            ItemSeparatorComponent={this.renderSeparator}
            scrollEnabled={supportedCreators.length > 0}
            ListEmptyComponent={this.renderSupportedCreatorEmptyList}
            style={Style.List}
          />
        )}
      </React.Fragment>
    )
  }

  private renderSupportedContentList(week: StatisticsSupportedWeek) {
    const { selectedDayOfWeek } = this.props.dataStore
    const {
      contents: supportedContent = []
    } = week.days[selectedDayOfWeek] || {}
    const key = week ? `${week.startTs}-${selectedDayOfWeek}` : null
    return (
      <React.Fragment>
        <Text
          tx="StatisticsSupportedScreen.ListTitle.Content"
          style={Style.ListHeaderText}
        />
        <FlatList<StatisticsSupportedContent>
          key={key}
          data={supportedContent}
          keyExtractor={this.contentListItemKeyExtractor}
          scrollEnabled={supportedContent.length > 0}
          renderItem={this.renderSupportedContentListItem}
          ItemSeparatorComponent={this.renderSeparator}
          ListEmptyComponent={this.renderSupportedContentEmptyList}
          style={Style.List}
        />
      </React.Fragment>
    )
  }

  private renderSeparator = () => <View style={Style.Separator} />

  private renderSupportedCreatorListItem:
    ListRenderItem<StatisticsSupportedCreator> = ({ item }) => (
      <StatisticsSupportedCreatorListItem creator={item} />
    )

  private renderSupportedContentListItem:
    ListRenderItem<StatisticsSupportedContent> = ({ item }) => (
      <StatisticsSupportedContentListItem content={item} />
    )

  private renderSupportedCreatorListItemSkeleton: ListRenderItem<any> = () => (
    <StatisticsListItemSkeleton type="supported-creator" />
  )

  private renderSupportedCreatorEmptyList = () => {
    return (
      <View style={Style.Empty}>
        <Text
          tx="StatisticsSupportedScreen.Empty.Creator"
          style={Style.EmptyLabel}
        />
      </View>
    )
  }

  private renderSupportedContentEmptyList = () => {
    return (
      <View style={Style.Empty}>
        <Text
          tx="StatisticsSupportedScreen.Empty.Content"
          style={Style.EmptyLabel}
        />
      </View>
    )
  }
}
