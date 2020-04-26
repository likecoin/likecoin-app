import * as React from "react"
import {
  View,
  Dimensions,
} from "react-native"
import { SectionList } from "react-navigation"
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
  state = {
    sliderWidth: Dimensions.get("window").width,
  }

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

  private skeletonListItemKeyExtractor =
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
        {this.renderSupportedList()}
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

  private renderSupportedList() {
    const {
      selectedWeek: week,
      selectedDayOfWeek,
      hasSelectedDayOfWeek,
    } = this.props.dataStore
    const {
      creators: supportedCreators = [],
      days = [],
    } = week || {}
    const {
      contents: supportedContent = []
    } = days[selectedDayOfWeek] || {}

    return (
      <SectionList
        ListHeaderComponent={(
          <View
            style={Style.Carousel}
            onLayout={event => {
              this.setState({ sliderWidth: event.nativeEvent.layout.width })
            }}
          >
            <Carousel<StatisticsSupportedWeek>
              data={this.props.dataStore.weekList}
              renderItem={this.renderDashboard}
              itemWidth={this.state.sliderWidth}
              sliderWidth={this.state.sliderWidth}
              onBeforeSnapToItem={this.onBeforeSnapToWeek}
              onScroll={this.onScrollDashboard}
            />
          </View>
        )}
        sections={[
          week.isFetching
            ? {
              key: "loading",
              data: new Array(3),
              keyExtractor: this.skeletonListItemKeyExtractor
            }
            : (
              hasSelectedDayOfWeek
                ? {
                  key: "contents",
                  data: [...supportedContent],
                  keyExtractor: this.contentListItemKeyExtractor,
                }
                : {
                  key: "creators",
                  data: [...supportedCreators],
                  keyExtractor: this.creatorListItemKeyExtractor
                }
            ),
        ]}
        renderItem={({ item, section }) => {
          if (section.key === "loading") {
            return <StatisticsListItemSkeleton type="supported-creator" />
          }
          if (section.key === "creators") {
            return <StatisticsSupportedCreatorListItem creator={item} />
          }
          return <StatisticsSupportedContentListItem content={item} />
        }}
        renderSectionHeader={() => {
          return (
            <Text
              tx={`StatisticsSupportedScreen.ListTitle.${
                hasSelectedDayOfWeek ? "Content" : "Creator"
              }`}
              style={Style.ListHeaderText}
            />
          )
        }}
        renderSectionFooter={({ section }) =>
          section.data.length > 0
            ? null
            : (
              <View style={Style.Empty}>
                <Text
                  tx={`StatisticsSupportedScreen.Empty.${
                    hasSelectedDayOfWeek ? "Content" : "Creator"
                  }`}
                  style={Style.EmptyLabel}
                />
              </View>
            )}
        ItemSeparatorComponent={this.renderSeparator}
        style={Style.List}
      />
    )
  }

  private renderSeparator = () => (
    <View style={Style.SeparatorWrapper}>
      <View style={Style.Separator} />
    </View>
  )
}
