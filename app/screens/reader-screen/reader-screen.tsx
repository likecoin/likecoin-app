import * as React from "react"
import { View, NativeSyntheticEvent } from "react-native"
import { inject, observer } from "mobx-react"
import ViewPager, {
  ViewPagerOnPageSelectedEventData,
} from "@react-native-community/viewpager"
import moment from "moment"

import {
  ReaderScreenProps as Props,
  ReaderSectionListData,
} from "./reader-screen.props"
import { ReaderScreenStyle as Style } from "./reader-screen.style"

import { Button } from "../../components/button"
import { Text } from "../../components/text"
import {
  ContentList,
  SuperLikeContentList,
} from "../../components/content-list"
import { wrapContentListScreen } from "../../components/content-list-screen"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"

import { SuperLikedContent } from "../../models/super-liked-content"
import { UserStore } from "../../models/user-store"

import { translate } from "../../i18n"
import { logAnalyticsEvent } from "../../utils/analytics"

@inject((allStore: any) => ({
  currentUser: (allStore.userStore as UserStore).currentUser,
}))
@observer
class ReaderScreenBase extends React.Component<Props> {
  legacyList = React.createRef<ContentList>()

  viewPager = React.createRef<ViewPager>()

  state = {
    activePageIndex: 0,
  }

  get superLikeFeedPageTitle() {
    if (this.sections.length) {
      return this.sections[this.state.activePageIndex].title
    }
    return ""
  }

  componentDidMount() {
    if (this.props.currentUser.isSuperLiker) {
      this.props.readerStore.fetchFollowedSuperLikedFeed()
    } else {
      this.legacyList.current.props.onRefresh()
    }
    this.props.readerStore.fetchCreatorList()
    this.props.readerStore.fetchBookmarkList()
  }

  private getSectionTitle = (dayTs: string) => {
    const mm = moment(parseInt(dayTs, 10))
    const today = moment().startOf("day")
    if (mm.isSameOrAfter(today)) {
      return translate("Date.Today")
    }
    if (mm.isSameOrAfter(today.subtract(1, "day"))) {
      return translate("Date.Yesterday")
    }
    return mm.format("DD-MM-YYYY")
  }

  private reduceGroupToSections = (
    sections: ReaderSectionListData<SuperLikedContent>[],
    dayTs: string,
  ) => {
    sections.push({
      data: this.props.readerStore.followingSuperLikePages[dayTs],
      key: dayTs,
      title: this.getSectionTitle(dayTs),
    })
    return sections
  }

  private get sections() {
    if (
      !Object.keys(this.props.readerStore.followingSuperLikePages).length
    ) {
      return [
        {
          data: [] as SuperLikedContent[],
          key: "placeholder",
          title: translate("Date.Today") as string,
        },
      ]
    }
    return Object.keys(this.props.readerStore.followingSuperLikePages)
      .sort()
      .reverse()
      .reduce(this.reduceGroupToSections, [])
  }

  private fetchMoreSuperLikedFeed = () => {
    this.props.readerStore.fetchFollowedSuperLikedFeed({ isMore: true })
  }

  private onPressGlobalIcon = () => {
    logAnalyticsEvent("GoToGlobalSuperLikedFeed")
    this.props.navigation.navigate("GlobalSuperLikedFeed")
  }

  private onPageSelected = (
    event: NativeSyntheticEvent<ViewPagerOnPageSelectedEventData>,
  ) => {
    const pageIndex = event.nativeEvent.position
    this.setState({
      activePageIndex: pageIndex,
    })
    // Fetch more when selecting second last page
    if (pageIndex === this.sections.length - 2) {
      this.fetchMoreSuperLikedFeed()
    }
  }

  render() {
    if (this.props.currentUser.isSuperLiker) {
      return this.renderSuperLikeScreen()
    }
    return (
      <Screen style={Style.Root} preset="fixed">
        <Header headerTx="readerScreen.Title" />
        {this.renderList()}
      </Screen>
    )
  }

  private renderSuperLikeScreen() {
    return (
      <Screen style={Style.Root} preset="fixed">
        <View style={Style.ContentWrapper}>
          <Header
            rightView={this.renderHeaderRightView()}
            style={Style.SuperLikeHeader}
          >
            <View style={Style.SuperLikeHeaderMiddleView}>
              <Button
                preset="plain"
                icon="arrow-left"
                size="small"
                disabled={
                  this.state.activePageIndex === this.sections.length - 1
                }
                onPress={() => {
                  this.viewPager.current.setPage(this.state.activePageIndex + 1)
                }}
              />
              <Text
                text={this.superLikeFeedPageTitle}
                style={Style.DateLabel}
              />
              <Button
                preset="plain"
                icon="arrow-right"
                size="small"
                disabled={this.state.activePageIndex === 0}
                onPress={() => {
                  this.viewPager.current.setPage(this.state.activePageIndex - 1)
                }}
              />
            </View>
          </Header>
          <ViewPager
            ref={this.viewPager}
            scrollEnabled={false}
            style={Style.ViewPager}
            onPageSelected={this.onPageSelected}
          >
            {this.sections.map(this.renderSuperLikeFeed)}
          </ViewPager>
        </View>
      </Screen>
    )
  }

  private renderHeaderRightView = () => {
    if (this.state.activePageIndex > 0) {
      return (
        <Button
          preset="plain"
          color="likeGreen"
          tx="Date.Today"
          style={Style.TodayButtonText}
          onPress={() => {
            this.viewPager.current.setPage(0)
          }}
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

  private renderList = () => {
    return (
      <ContentList
        ref={this.legacyList}
        data={this.props.readerStore.followedList}
        creators={this.props.readerStore.creators}
        isLoading={this.props.readerStore.isFetchingFollowedList}
        isFetchingMore={this.props.readerStore.isFetchingMoreFollowedList}
        hasFetched={this.props.readerStore.hasFetchedFollowedList}
        hasFetchedAll={this.props.readerStore.hasReachedEndOfFollowedList}
        lastFetched={this.props.readerStore.followedListLastFetchedDate.getTime()}
        onFetchMore={this.props.readerStore.fetchMoreFollowedList}
        onPressUndoUnfollowButton={this.props.onPressUndoUnfollowButton}
        onPressItem={this.props.onPressContentItem}
        onToggleBookmark={this.props.onToggleBookmark}
        onToggleFollow={this.props.onToggleFollow}
        onRefresh={this.props.readerStore.fetchFollowingList}
        style={Style.List}
      />
    )
  }

  private renderSuperLikeFeed = (
    section: ReaderSectionListData<SuperLikedContent>,
  ) => {
    return (
      <SuperLikeContentList
        key={section.key}
        data={section.data}
        creators={this.props.readerStore.creators}
        isLoading={
          // FIXME: Need proper page reload instead of reloading all pages
          this.state.activePageIndex === 0 && this.props.readerStore.isFetchingFollowedList
        }
        isFetchingMore={this.props.readerStore.isFetchingFollowedList}
        hasFetched={this.props.readerStore.hasFetchedFollowedList}
        hasFetchedAll={this.props.readerStore.hasReachedEndOfFollowedList}
        lastFetched={this.props.readerStore.followedListLastFetchedDate.getTime()}
        onPressUndoUnfollowButton={this.props.onPressUndoUnfollowButton}
        onPressItem={this.props.onPressSuperLikeItem}
        onToggleBookmark={this.props.onToggleBookmark}
        onToggleFollow={this.props.onToggleFollow}
        style={Style.SuperLikeFeed}
      />
    )
  }
}

export const ReaderScreen = wrapContentListScreen(ReaderScreenBase)
