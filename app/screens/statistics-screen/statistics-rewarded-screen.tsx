import * as React from "react"
import {
  ListRenderItem,
  View,
  Dimensions,
} from "react-native"
import {
  FlatList,
  SectionList,
} from "react-navigation"
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
        <View style={CommonStyle.Carousel}>
          <Carousel<StatisticsRewardedWeek>
            data={this.props.dataStore.weekList}
            renderItem={this.renderDashboard}
            itemWidth={sliderWidth}
            sliderWidth={sliderWidth}
            onBeforeSnapToItem={this.onBeforeSnapToWeek}
            onScroll={this.onScrollDashboard}
          />
        </View>
        {selectedWeek && hasSelectedDayOfWeek ? (
          this.renderDailyRewardedContentList(selectedWeek)
        ) : (
          this.renderWeeklyRewardedContentList(selectedWeek)
        )}
      </Screen>
    )
  }

  private renderDashboard = ({ item: weekData, index }: {
    item: StatisticsRewardedWeek
    index: number
  }) => {
    return (
      <StatisticsRewardedDashbaord
        key={weekData.startTs}
        store={this.props.dataStore}
        week={weekData}
        index={index}
        onPressBarInChart={this.onPressBarInChart}
      />
    )
  }

  private renderWeeklyRewardedContentList(week: StatisticsRewardedWeek) {
    const {
      contentList: rewardedContents = [],
      isFetching = false,
      hasFetched = false,
    } = week || {}
    const key = week ? `${week.startTs}` : null
    return (
      <React.Fragment>
        <SectionList
          key={key}
          sections={[{ data: !isFetching && hasFetched ? rewardedContents : [] }]}
          keyExtractor={this.contentListItemKeyExtractor}
          scrollEnabled={rewardedContents.length > 0}
          renderItem={this.renderRewardedContentListItem}
          renderSectionHeader={this.renderSectionHeader}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={() => this.renderListHeader(week)}
          style={CommonStyle.List}
        />
      </React.Fragment>
    )
  }

  private renderListHeader = (week: StatisticsRewardedWeek) => {
    const {
      likesCount = 0,
      basicLikersCount = 0,
      civicLikersCount = 0,
    } = week || {}

    const lastWeekIndex = this.props.dataStore.weekList
      .findIndex(w => w.startTs === week.startTs) + 1
    const {
      likesCount: lastWeekLikesCount = 0,
    } = this.props.dataStore.weekList[lastWeekIndex] || {}
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

  private renderDailyRewardedContentList(week: StatisticsRewardedWeek) {
    const { selectedDayOfWeek } = this.props.dataStore
    const {
      contents: dailyRewardedContents = []
    } = week.days[selectedDayOfWeek] || {}
    const key = week ? `${week.startTs}-${selectedDayOfWeek}` : null
    return (
      <React.Fragment>
        <Text
          tx="StatisticsRewardedScreen.ListTitle.Content"
          style={CommonStyle.ListHeaderText}
        />
        <FlatList<StatisticsRewardedContent>
          key={key}
          data={dailyRewardedContents}
          keyExtractor={this.contentListItemKeyExtractor}
          scrollEnabled={dailyRewardedContents.length > 0}
          renderItem={this.renderRewardedContentListItem}
          ItemSeparatorComponent={this.renderSeparator}
          style={CommonStyle.List}
        />
      </React.Fragment>
    )
  }

  private renderSeparator = () => <View style={CommonStyle.Separator} />

  private renderRewardedContentListItem:
    ListRenderItem<StatisticsRewardedContent> = ({ item }) => (
      <StatisticsRewardedContentListItem content={item} />
    )
}
