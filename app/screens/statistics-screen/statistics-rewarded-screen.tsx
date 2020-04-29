import * as React from "react"
import {
  View,
  Dimensions,
} from "react-native"
import { SectionList } from "react-navigation"
import { observer, inject } from "mobx-react"
import Carousel from "react-native-snap-carousel"

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
  StatisticsRewardedDashbaord,
} from "./statistics-rewarded-dashboard"

import { Header } from "../../components/header"
import { Icon } from "../../components/icon"
import { Screen } from "../../components/screen"
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
import { calcPercentDiff } from "../../utils/number"

@inject(allStores => ({
  dataStore: (allStores as any).statisticsRewardedStore as StatisticsRewardedStore,
}))
@observer
export class StatisticsRewardedScreen extends React.Component<Props> {
  state = {
    sliderWidth: Dimensions.get("window").width,
  }

  private onPressHeaderLeft = () => {
    this.props.navigation.goBack()
  }

  componentDidMount() {
    this.props.dataStore.fetchLatest({
      shouldFetchLastWeek: true,
    })
  }

  private contentListItemKeyExtractor =
    (item: StatisticsRewardedContent) => item.id

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
        style={CommonStyle.Screen}
      >
        <View style={CommonStyle.BackdropWrapper}>
          <View style={CommonStyle.Backdrop} />
        </View>
        <Header
          headerTx="StatisticsRewardedScreen.Title"
          leftIcon="back"
          onLeftPress={this.onPressHeaderLeft}
        />
        {this.renderContentList()}
      </Screen>
    )
  }

  private renderDashboard = ({ item: weekData, index }: {
    item: StatisticsRewardedWeek
    index: number
  }) => {
    return (
      <StatisticsRewardedDashbaord
        store={this.props.dataStore}
        week={weekData}
        index={index}
        onPressBarInChart={this.onPressBarInChart}
      />
    )
  }

  private renderContentList() {
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

    console.tron.log("renderContentList")

    return (
      <SectionList
        ListHeaderComponent={(
          <React.Fragment>
            {this.renderCarousel()}
            {this.renderWeekSummary(week)}
          </React.Fragment>
        )}
        sections={[
          isFetching ? {
            key: "loading",
            data: new Array(3),
            keyExtractor: this.skeletonListItemKeyExtractor,
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
        renderItem={({ item, section }) => {
          if (section.key === "loading") {
            return <StatisticsListItemSkeleton type="supported-creator" />
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
        }}
        renderSectionHeader={this.renderSectionHeader}
        renderSectionFooter={({ section }) =>
          section.data.length > 0
            ? null
            : (
              <View style={CommonStyle.Empty}>
                <Text
                  tx="StatisticsRewardedScreen.Empty.Content"
                  style={CommonStyle.EmptyLabel}
                />
              </View>
            )}
        ItemSeparatorComponent={this.renderSeparator}
        style={CommonStyle.List}
      />
    )
  }

  private renderCarousel = () => {
    return (
      <View
        style={CommonStyle.Carousel}
        onLayout={event => {
          this.setState({ sliderWidth: event.nativeEvent.layout.width })
        }}
      >
        <Carousel<StatisticsRewardedWeek>
          data={this.props.dataStore.weekList}
          renderItem={this.renderDashboard}
          itemWidth={this.state.sliderWidth}
          sliderWidth={this.state.sliderWidth}
          onBeforeSnapToItem={this.onBeforeSnapToWeek}
          onScroll={this.onScrollDashboard}
        />
      </View>
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
                text={`${Math.abs(growthPercentage)}%`}
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

  private renderSectionHeader = () => {
    return (
      <Text
        tx="StatisticsRewardedScreen.ListTitle.Content"
        style={CommonStyle.ListHeaderText}
      />
    )
  }

  private renderSeparator = () => (
    <View style={CommonStyle.SeparatorWrapper}>
      <View style={CommonStyle.Separator} />
    </View>
  )
}
