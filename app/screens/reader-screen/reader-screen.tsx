import * as React from "react"
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
} from "../../components/content-list"
import {
  wrapContentListScreen,
} from "../../components/content-list-screen"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"

import { translate } from "../../i18n"
import { logAnalyticsEvent } from "../../utils/analytics"

class ReaderScreenBase extends React.Component<Props> {
  list = React.createRef<ContentList>()

  componentDidMount() {
    this.list.current.props.onRefresh()
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
    sections: ReaderSectionListData[],
    dayTs: string
  ) => {
    sections.push({
      data: this.props.readerStore.followedListGroups[dayTs],
      key: dayTs,
      title: this.getSectionTitle(dayTs)
    })
    return sections
  }

  private get sections() {
    if (!this.props.readerStore.followedListGroups) {
      return []
    }
    return Object.keys(this.props.readerStore.followedListGroups)
      .sort()
      .reverse()
      .reduce(this.reduceGroupToSections, [])
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
          rightView={(
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
        {this.renderList()}
      </Screen>
    )
  }

  private renderSectionHeader = ({
    section: { title },
  }: {
    section: ReaderSectionListData
  }) => {
    return (
      <ContentListSectionHeader text={title} />
    )
  }

  private renderList = () => {
    return (
      <ContentList
        ref={this.list}
        sections={this.sections}
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
        renderSectionHeader={this.renderSectionHeader}
        style={Style.List}
      />
    )
  }
}

export const ReaderScreen = wrapContentListScreen(
  ReaderScreenBase
)
