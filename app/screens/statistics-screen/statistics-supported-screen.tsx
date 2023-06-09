import * as React from "react"
import {
  SectionListData,
  SectionListRenderItem,
  View,
} from "react-native"
import { SectionList } from "react-navigation"
import { observer, inject } from "mobx-react"
import Carousel from "react-native-snap-carousel"

import {
  wrapStatisticsScreenBase,
} from "./statistics-screen"
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
  StatisticsSupportedDashboard,
} from "./statistics-supported-dashboard"

import { UnderlayView } from "../../components/extended-view"
import {
  StatisticsListItemSkeleton,
} from "../../components/statistics-list-item"
import { Text } from "../../components/text"

import {
  StatisticsSupportedContent,
  StatisticsSupportedCreator,
  StatisticsSupportedDay,
  StatisticsSupportedStore,
  StatisticsSupportedWeek,
} from "../../models/statistics-store"

type StatisticsSupportedItemType =
  StatisticsSupportedCreator | StatisticsSupportedContent

@observer
class StatisticsSupportedScreenBase extends React.Component<Props> {
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

  private onBeforeSnapToWeek = (weekIndex: number) => {
    this.props.dataStore.selectWeek(weekIndex)
  }

  private renderDashboard = ({ item: weekData, index }: {
    item: StatisticsSupportedWeek
    index: number
  }) => {
    return (
      <StatisticsSupportedDashboard
        store={this.props.dataStore}
        week={weekData}
        index={index}
        onPressBarInChart={this.props.onSelectDay}
      />
    )
  }

  render() {
    const {
      selectedWeek: week,
      selectedDayOfWeek,
      hasSelectedDayOfWeek,
    } = this.props.dataStore
    const {
      creators: supportedCreators = [] as StatisticsSupportedCreator[],
      days = [] as StatisticsSupportedDay[],
    } = week || {}
    const {
      contents: supportedContent = [] as StatisticsSupportedContent[]
    } = days[selectedDayOfWeek] || {}

    return (
      <SectionList<StatisticsSupportedItemType>
        ListHeaderComponent={(
          <View
            style={Style.Carousel}
            onLayout={this.props.onLayoutCarousel}
          >
            <Carousel<StatisticsSupportedWeek>
              data={this.props.dataStore.weekList}
              renderItem={this.renderDashboard}
              itemWidth={this.props.carouselWidth}
              sliderWidth={this.props.carouselWidth}
              onBeforeSnapToItem={this.onBeforeSnapToWeek}
              onScroll={this.props.onScrollDashboard}
            />
          </View>
        )}
        sections={[
          week.isFetching
            ? {
              key: "loading",
              data: new Array(3),
              keyExtractor: this.props.skeletonListItemKeyExtractor
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
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        renderSectionFooter={this.renderSectionFooter}
        ItemSeparatorComponent={this.props.renderSeparator}
        style={Style.List}
        onScroll={this.props.onScroll}
      />
    )
  }

  private renderItem: SectionListRenderItem<StatisticsSupportedItemType> = ({
    item,
    section,
  }) => {
    if (section.key === "loading") {
      return <StatisticsListItemSkeleton type="supported-creator" />
    }
    if (section.key === "creators") {
      return (
        <StatisticsSupportedCreatorListItem
          creator={item as StatisticsSupportedCreator}
        />
      )
    }
    return (
      <StatisticsSupportedContentListItem
        content={item as StatisticsSupportedContent}
      />
    )
  }

  private renderSectionHeader = () => (
    <Text
      tx={`StatisticsSupportedScreen.ListTitle.${
        this.props.dataStore.hasSelectedDayOfWeek
          ? "Content"
          : "Creator"
      }`}
      style={Style.ListHeaderText}
    />
  )

  private renderSectionFooter = ({
    section
  }: {
    section: SectionListData<StatisticsSupportedItemType>
  }) =>
    section.data.length > 0
      ? null
      : (
        <View style={Style.Empty}>
          <UnderlayView />
          <Text
            tx={`StatisticsSupportedScreen.Empty.${
              this.props.dataStore.hasSelectedDayOfWeek
                ? "Content"
                : "Creator"
            }`}
            style={Style.EmptyLabel}
          />
        </View>
      )
}

export const StatisticsSupportedScreen = inject(
  (allStores: any) => ({
    dataStore:
      allStores.statisticsSupportedStore as StatisticsSupportedStore,
  })
)(
  wrapStatisticsScreenBase(
    StatisticsSupportedScreenBase,
    "StatisticsSupportedScreen.Title"
  )
)
