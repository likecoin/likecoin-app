import * as React from "react"
import { inject, observer } from "mobx-react"
import moment from "moment"

import {
  ReaderScreenProps as Props,
  ReaderSectionListData,
} from "./reader-screen.props"
import { ReaderScreenStyle as Style } from "./reader-screen.style"
import { GlobalIcon } from "./global-icon"

import { Button } from "../../components/button"
import {
  ContentList,
  ContentListSectionHeader,
  SuperLikedContentList,
} from "../../components/content-list"
import {
  wrapContentListScreen,
} from "../../components/content-list-screen"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"

import {
  SuperLikedContent,
} from "../../models/super-liked-content"
import { UserStore } from "../../models/user-store"

import { translate } from "../../i18n"
import { logAnalyticsEvent } from "../../utils/analytics"

@inject((allStore: any) => ({
  currentUser: (allStore.userStore as UserStore).currentUser,
}))
@observer
class ReaderScreenBase extends React.Component<Props> {
  legacyList = React.createRef<ContentList>()

  superLikeList = React.createRef<SuperLikedContentList>()

  componentDidMount() {
    if (this.props.currentUser.isSuperLiker) {
      this.superLikeList.current.props.onRefresh()
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
    dayTs: string
  ) => {
    sections.push({
      data: this.props.readerStore.followedSuperLikedFeedSections[dayTs],
      key: dayTs,
      title: this.getSectionTitle(dayTs)
    })
    return sections
  }

  private get sections() {
    if (!this.props.readerStore.followedSuperLikedFeedSections) {
      return []
    }
    return Object.keys(this.props.readerStore.followedSuperLikedFeedSections)
      .sort()
      .reverse()
      .reduce(this.reduceGroupToSections, [])
  }

  private fetchMoreSuperLikedFeed = () => {
    this.props.readerStore.fetchFollowedSuperLikedFeed({ isMore: true })
  }

  private onPressGlobalIcon = () => {
    logAnalyticsEvent('GoToGlobalSuperLikedFeed')
    this.props.navigation.navigate("GlobalSuperLikedFeed")
  }

  render() {
    return (
      <Screen
        style={Style.Root}
        preset="fixed"
      >
        <Header
          headerTx="readerScreen.Title"
          rightView={!this.props.currentUser.isSuperLiker ? null : (
            <Button
              preset="icon"
              onPress={this.onPressGlobalIcon}
              style={Style.GlobalIcon}
            >
              <GlobalIcon
                width={30}
                height={24}
              />
            </Button>
          )}
        />
        {this.props.currentUser.isSuperLiker
          ? this.renderSuperLikedList()
          : this.renderList()
        }
      </Screen>
    )
  }

  private renderSectionHeader = ({
    section: { title },
  }: {
    section: ReaderSectionListData<SuperLikedContent>
  }) => {
    return (
      <ContentListSectionHeader text={title} />
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

  private renderSuperLikedList = () => {
    return (
      <SuperLikedContentList
        ref={this.superLikeList}
        sections={this.sections}
        creators={this.props.readerStore.creators}
        isLoading={this.props.readerStore.isFetchingFollowedList}
        isFetchingMore={this.props.readerStore.isFetchingMoreFollowedList}
        hasFetched={this.props.readerStore.hasFetchedFollowedList}
        hasFetchedAll={this.props.readerStore.hasReachedEndOfFollowedList}
        lastFetched={this.props.readerStore.followedListLastFetchedDate.getTime()}
        onFetchMore={this.fetchMoreSuperLikedFeed}
        onPressUndoUnfollowButton={this.props.onPressUndoUnfollowButton}
        onPressItem={this.props.onPressContentItem}
        onToggleBookmark={this.props.onToggleBookmark}
        onToggleFollow={this.props.onToggleFollow}
        onRefresh={this.props.readerStore.fetchFollowedSuperLikedFeed}
        renderSectionHeader={this.renderSectionHeader}
        style={Style.List}
      />
    )
  }
}

export const ReaderScreen = wrapContentListScreen(
  ReaderScreenBase
)
