import * as React from "react"
import { Dimensions, FlatList, ListRenderItem, View } from "react-native"
import { observer, inject } from "mobx-react"
import moment from "moment"

import { translate } from "../../i18n"
import { logAnalyticsEvent } from "../../utils/analytics"

import { Content } from "../../models/content"
import { SuperLikeDailyFeed } from "../../models/super-like-daily-feed"

import { Button } from "../../components/button"
import { wrapContentListScreen } from "../../components/content-list-screen"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"
import { SuperLikeDailyFeedView } from "../../components/super-like-daily-feed-view"
import { Text } from "../../components/text"

import { SuperLikeFollowingScreenProps as Props } from "./super-like-following-screen.props"
import { SuperLikeFollowingScreenStyle as Style } from "./super-like-following-screen.style"

@inject("superLikeFollowingStore")
@observer
export class SuperLikeFollowingScreenBase extends React.Component<Props, {}> {
  pageList = React.createRef<FlatList<SuperLikeDailyFeed>>()

  get superLikeFeedPageTitle() {
    const { selectedFeed } = this.props.superLikeFollowingStore
    if (selectedFeed) {
      if (selectedFeed.isToday()) {
        return translate("Date.Today") as string
      }
      if (selectedFeed.isYesterday()) {
        return translate("Date.Yesterday") as string
      }
      return moment(selectedFeed.start).format("DD-MM-YYYY")
    }
    return ""
  }

  componentDidMount() {
    this.props.superLikeFollowingStore.refreshPage()
  }

  private extractPageKey = (feed: SuperLikeDailyFeed) => feed.id

  private getPageLayout = (_: SuperLikeDailyFeed[], index: number) => {
    const windowWidth = Dimensions.get("window").width
    return {
      length: windowWidth,
      offset: windowWidth * index,
      index,
    }
  }

  public onResume = () => {
    this.props.superLikeFollowingStore.refreshPage()
  }

  private onPressGlobalIcon = () => {
    logAnalyticsEvent("GoToGlobalSuperLikedFeed")
    this.props.navigation.navigate("SuperLikeGlobalFeed")
  }

  private onPressTodayButton = () => {
    this.pageList.current.scrollToIndex({
      index: 0,
      animated: this.props.superLikeFollowingStore.selectedPageIndex === 1,
    })
    this.props.superLikeFollowingStore.goToPage(0)
  }

  private onPressNextPageButton = () => {
    const index = this.props.superLikeFollowingStore.goToNextPage()
    this.pageList.current.scrollToIndex({ index })
  }

  private onPressPreviousPageButton = () => {
    const index = this.props.superLikeFollowingStore.goToPreviousPage()
    this.pageList.current.scrollToIndex({ index })
  }

  private onToggleBookmark = (content: Content) => {
    if (this.props.onToggleBookmark) this.props.onToggleBookmark(content)
    logAnalyticsEvent(
      `SLFollowingFeed${content.isBookmarked ? "Remove" : "Add"}Bookmark`,
      { url: content.url },
    )
  }

  private renderHeader = () => {
    const { isLastPage, isFirstPage } = this.props.superLikeFollowingStore
    return (
      <Header
        rightView={this.renderHeaderRightView()}
        style={Style.SuperLikeHeader}
      >
        <View style={Style.SuperLikeHeaderMiddleView}>
          <Button
            preset="plain"
            icon="arrow-left"
            size="small"
            disabled={isLastPage}
            onPress={this.onPressNextPageButton}
          />
          <Text text={this.superLikeFeedPageTitle} style={Style.DateLabel} />
          <Button
            preset="plain"
            icon="arrow-right"
            size="small"
            disabled={isFirstPage}
            onPress={this.onPressPreviousPageButton}
          />
        </View>
      </Header>
    )
  }

  private renderHeaderRightView = () => {
    if (!this.props.superLikeFollowingStore.isFirstPage) {
      return (
        <Button
          preset="plain"
          color="likeGreen"
          tx="Date.Today"
          style={Style.TodayButtonText}
          onPress={this.onPressTodayButton}
        />
      )
    }
    return (
      <Button
        preset="secondary"
        icon="global-eye"
        size="small"
        onPress={this.onPressGlobalIcon}
      />
    )
  }

  private renderPageList = () => {
    return (
      <FlatList<SuperLikeDailyFeed>
        ref={this.pageList}
        pagingEnabled={true}
        scrollEnabled={false}
        renderItem={this.renderPage}
        data={this.props.superLikeFollowingStore.pagedFeeds}
        getItemLayout={this.getPageLayout}
        horizontal={true}
        initialNumToRender={1}
        windowSize={2}
        updateCellsBatchingPeriod={1}
        maxToRenderPerBatch={1}
        initialScrollIndex={0}
        inverted={true}
        keyExtractor={this.extractPageKey}
        style={Style.PageList}
      />
    )
  }

  private renderPage: ListRenderItem<SuperLikeDailyFeed> = ({ item: feed }) => {
    return (
      <SuperLikeDailyFeedView
        feed={feed}
        onPressUndoUnfollowButton={this.props.onPressUndoUnfollowButton}
        onPressItem={this.props.onPressSuperLikeItem}
        onToggleBookmark={this.onToggleBookmark}
        onToggleFollow={this.props.onToggleFollow}
        style={Style.Page}
      />
    )
  }

  render() {
    return (
      <Screen style={Style.Root} preset="fixed">
        <View style={Style.ContentWrapper}>
          {this.renderHeader()}
          {this.renderPageList()}
        </View>
      </Screen>
    )
  }
}

export const SuperLikeFollowingScreen = wrapContentListScreen(
  SuperLikeFollowingScreenBase,
)
