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
  StatisticsRewardedScreenProps as Props,
} from "./statistics-rewarded-screen.props"
import {
  StatisticsScreenStyle as CommonStyle,
} from "./statistics-screen.style"
import {
  StatisticsRewardedScreenStyle as Style,
} from "./statistics-rewarded-screen.style"
import {
  StatisticsRewardedContentListItem,
} from "./statistics-rewarded-content-list-item"
import {
  StatisticsRewardedDashboard,
} from "./statistics-rewarded-dashboard"

import { UnderlayView } from "../../components/extended-view"
import { Icon } from "../../components/icon"
import {
  StatisticsListItemSkeleton,
} from "../../components/statistics-list-item"
import { Text } from "../../components/text"

import {
  StatisticsRewardedContent,
  StatisticsRewardedStore,
  StatisticsRewardedWeek,
} from "../../models/statistics-store"

import { color } from "../../theme"
import {
  calcPercentDiff,
  withAbsPercent,
} from "../../utils/number"

const StatisticsRewardedSectionList:
  SectionList<StatisticsRewardedContent> = SectionList

@observer
class StatisticsRewardedScreenBase extends React.Component<Props> {
  componentDidMount() {
    this.props.dataStore.fetchLatest({
      shouldFetchLastWeek: true,
    })
  }

  private contentListItemKeyExtractor =
    (item: StatisticsRewardedContent) => item.id

  private onBeforeSnapToWeek = (weekIndex: number) => {
    this.props.dataStore.selectWeek(weekIndex)
  }

  private onPressGetRewardsButton = () => {
    this.props.navigation.navigate("Referral", { action: "copy" })
  }

  render() {
    const {
      selectedWeek: week,
      selectedDayOfWeek,
      hasSelectedDayOfWeek,
    } = this.props.dataStore
    const {
      contentList: rewardedContents = [],
      days = [],
      isFetching = false,
    } = week || {}
    const {
      contents: dailyRewardedContents = []
    } = days[selectedDayOfWeek] || {}

    return (
      <StatisticsRewardedSectionList
        ListHeaderComponent={(
          <React.Fragment>
            {this.renderCarousel()}
            {!hasSelectedDayOfWeek && this.renderWeekSummary(week)}
          </React.Fragment>
        )}
        sections={[
          isFetching ? {
            key: "loading",
            data: new Array(3),
            keyExtractor: this.props.skeletonListItemKeyExtractor,
          } : (
            hasSelectedDayOfWeek
              ? {
                key: "day",
                data: [...dailyRewardedContents],
                keyExtractor: this.contentListItemKeyExtractor,
              }
              : {
                key: "week",
                data: [...rewardedContents],
                keyExtractor: this.contentListItemKeyExtractor,
              }
          ),
        ]}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        renderSectionFooter={this.renderSectionFooter}
        ItemSeparatorComponent={this.props.renderSeparator}
        style={CommonStyle.List}
        onScroll={this.props.onScroll}
      />
    )
  }

  private renderCarousel = () => {
    return (
      <View
        style={CommonStyle.Carousel}
        onLayout={this.props.onLayoutCarousel}
      >
        <Carousel<StatisticsRewardedWeek>
          data={this.props.dataStore.weekList}
          renderItem={this.renderDashboard}
          itemWidth={this.props.carouselWidth}
          sliderWidth={this.props.carouselWidth}
          onBeforeSnapToItem={this.onBeforeSnapToWeek}
          onScroll={this.props.onScrollDashboard}
        />
      </View>
    )
  }

  private renderDashboard = ({ item: weekData, index }: {
    item: StatisticsRewardedWeek
    index: number
  }) => {
    return (
      <StatisticsRewardedDashboard
        store={this.props.dataStore}
        week={weekData}
        index={index}
        onPressBarInChart={this.props.onSelectDay}
        onPressGetRewardsButton={this.onPressGetRewardsButton}
      />
    )
  }

  private renderWeekSummary = (week: StatisticsRewardedWeek) => {
    const {
      likesCount = 0,
      basicLikersCount = 0,
      civicLikersCount = 0,
    } = week || {}
    const {
      selectedLastWeek: {
        likesCount: lastWeekLikesCount = 0,
      } = {}
    } = this.props.dataStore
    const growthPercentage = calcPercentDiff(likesCount, lastWeekLikesCount)
    return (
      <View style={Style.Summary}>
        <View style={Style.SummaryLikesCount}>
          <Icon
            name="like-clap"
            width={32}
            height={32}
            fill={color.primary}
            style={Style.SummaryIcon}
          />
          <View>
            <Text
              text={`${likesCount}`}
              style={Style.SummaryLikesCountTitle}
            />
            {growthPercentage !== 0 && (
              <Text
                text={withAbsPercent(growthPercentage)}
                color={growthPercentage > 0 ? "green" : "angry"}
                prepend={(
                  <Icon
                    name={growthPercentage > 0 ? "arrow-increase" : "arrow-decrease"}
                    width={16}
                    height={16}
                    fill={growthPercentage > 0
                      ? color.palette.green
                      : color.palette.angry
                    }
                    style={Style.SummaryIcon}
                  />
                )}
              />
            )}
          </View>
        </View>
        <View style={Style.SummaryItem}>
          <View style={Style.SummaryTitleWrapper}>
            <Icon
              name="person"
              width={24}
              height={24}
              fill={color.primary}
              style={Style.SummaryIcon}
            />
            <Text
              text={`${civicLikersCount}`}
              style={Style.SummaryTitle}
            />
          </View>
          <Text
            tx="StatisticsRewardedScreen.Summary.CivicLiker"
            style={Style.SummarySubtitle}
          />
        </View>
        <View style={Style.SummaryItem}>
          <View style={Style.SummaryTitleWrapper}>
            <Icon
              name="person"
              width={24}
              height={24}
              fill={color.transparent}
              style={Style.SummaryIcon}
            />
            <Text
              text={`${basicLikersCount}`}
              style={Style.SummaryTitle}
            />
          </View>
          <Text
            tx="StatisticsRewardedScreen.Summary.Liker"
            style={Style.SummarySubtitle}
          />
        </View>
      </View>
    )
  }

  private renderItem: SectionListRenderItem<StatisticsRewardedContent> = ({ item, section }) => {
    if (section.key === "loading") {
      return (
        <StatisticsListItemSkeleton
          type="supported-creator"
        />
      )
    }
    if (section.key === "week") {
      return (
        <StatisticsRewardedContentListItem
          type="rewarded-content"
          content={item}
        />
      )
    }
    return (
      <StatisticsRewardedContentListItem
        type="rewarded-daily-content"
        content={item}
      />
    )
  }

  private renderSectionHeader = () => {
    return (
      <Text
        tx="StatisticsRewardedScreen.ListTitle.Content"
        style={CommonStyle.ListHeaderText}
      />
    )
  }

  private renderSectionFooter = ({
    section,
  }: {
    section: SectionListData<StatisticsRewardedContent>
  }) =>
    section.data.length > 0
      ? null
      : (
        <View style={CommonStyle.Empty}>
          <UnderlayView />
          <Text
            tx="StatisticsRewardedScreen.Empty.Content"
            style={CommonStyle.EmptyLabel}
          />
        </View>
      )
}

export const StatisticsRewardedScreen = inject(
  (allStores: any) => ({
    dataStore:
      allStores.statisticsRewardedStore as StatisticsRewardedStore,
  })
)(
  wrapStatisticsScreenBase(
    StatisticsRewardedScreenBase,
    "StatisticsRewardedScreen.Title"
  )
)
