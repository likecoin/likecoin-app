import * as React from "react"
import { NativeSyntheticEvent, View } from "react-native"
import ViewPager, {
  ViewPagerOnPageSelectedEventData,
} from "@react-native-community/viewpager"
import { observer } from "mobx-react"
import moment from "moment"

import { translate } from "../../i18n"
import { logAnalyticsEvent } from "../../utils/analytics"

import { SuperLike } from "../../models/super-like"

import { Button } from "../../components/button"
import { SuperLikeContentList } from "../../components/content-list"
import { wrapContentListScreen } from "../../components/content-list-screen"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"

import {
  SuperLikeFollowingScreenProps as Props,
  ReaderSectionListData,
} from "./super-like-following-screen.props"
import { SuperLikeFollowingScreenStyle as Style } from "./super-like-following-screen.style"

@observer
export class SuperLikeFollowingScreenBase extends React.Component<Props, {}> {
  viewPager = React.createRef<ViewPager>()

  state = {
    activePageIndex: 0,
  }

  get superLikeFeedPageTitle() {
    return (
      this.sections[this.state.activePageIndex]?.title ||
      (translate("Date.Today") as string)
    )
  }

  componentDidMount() {
    this.props.readerStore.fetchFollowedSuperLikedFeed()
  }

  public onResume = () => {
    this.props.readerStore.fetchFollowedSuperLikedFeed()
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
    sections: ReaderSectionListData<SuperLike>[],
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
          {/**
           * HACK: Seems <ViewPager/> has issue with sub view(s) update
           * This hack prevents it rendering blank
           */}
          {this.sections.length > 0 ? (
            <ViewPager
              ref={this.viewPager}
              initialPage={0}
              scrollEnabled={false}
              style={Style.ViewPager}
              onPageSelected={this.onPageSelected}
            >
              {this.sections.map(this.renderSuperLikeFeed)}
            </ViewPager>
          ) : (
            <SuperLikeContentList
              key="placeholder"
              creators={{} as any}
              data={[]}
              hasFetched={!this.props.readerStore.isFetchingFollowedList}
              isLoading={true}
              style={Style.EmptyList}
            />
          )}
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

  private renderSuperLikeFeed = (section: ReaderSectionListData<SuperLike>) => {
    return (
      <SuperLikeContentList
        key={section.key}
        data={section.data}
        creators={this.props.readerStore.creators}
        isLoading={
          // FIXME: Need proper page reload instead of reloading all pages
          this.state.activePageIndex === 0 &&
          this.props.readerStore.isFetchingFollowedList
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

export const SuperLikeFollowingScreen = wrapContentListScreen(
  SuperLikeFollowingScreenBase,
)
