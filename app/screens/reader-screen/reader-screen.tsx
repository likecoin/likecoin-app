import * as React from "react"
import { inject, observer } from "mobx-react"
import moment from "moment"

import {
  ReaderScreenProps as Props,
  ReaderSectionListData,
} from "./reader-screen.props"
import { ReaderScreenStyle as Style } from "./reader-screen.style"

import {
  ContentList,
  ContentListSectionHeader,
} from "../../components/content-list"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"

import { Content } from "../../models/content"

import { translate } from "../../i18n"
import { logAnalyticsEvent } from "../../utils/analytics"

@inject("readerStore")
@observer
export class ReaderScreen extends React.Component<Props> {
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

  private onPressContentItem = (url: string) => {
    const content = this.props.readerStore.contents.get(url)
    logAnalyticsEvent('select_content', { contentType: 'content', itemId: url })
    logAnalyticsEvent('OpenArticle', { url })
    this.props.navigation.navigate('ContentView', { content })
  }

  private onBookmarkContentItem = (url: string) => {
    this.props.readerStore.toggleBookmark(url)
  }

  private onFollowContentItem = (content: Content) => {
    const { isFollowing, likerID } = content.creator
    if (isFollowing) {
      logAnalyticsEvent("UnfollowLiker", { likerID })
      this.props.readerStore.toggleFollow(likerID)
    } else {
      logAnalyticsEvent("FollowLiker", { likerID })
      this.props.readerStore.toggleFollow(likerID)
    }
  }

  private onPressUndoButton = (content: Content) => {
    const { likerID } = content.creator
    logAnalyticsEvent('UndoUnfollow', { likerID })
    this.props.readerStore.toggleFollow(likerID)
  }

  render() {
    return (
      <Screen
        style={Style.Root}
        preset="fixed"
      >
        <Header headerTx="readerScreen.Title" />
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
        onToggleBookmark={this.onBookmarkContentItem}
        onToggleFollow={this.onFollowContentItem}
        onPressUndoButton={this.onPressUndoButton}
        onPressItem={this.onPressContentItem}
        onRefresh={this.props.readerStore.fetchFollowingList}
        renderSectionHeader={this.renderSectionHeader}
        style={Style.List}
      />
    )
  }
}
