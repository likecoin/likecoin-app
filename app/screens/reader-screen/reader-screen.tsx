import * as React from "react"
import { inject, observer } from "mobx-react"

import { ReaderScreenProps as Props } from "./reader-screen.props"
import { ReaderScreenStyle as Style } from "./reader-screen.style"

import { Screen } from "../../components/screen"
import { ContentList } from "../../components/content-list"

import { Content } from "../../models/content"

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
        {this.renderList()}
      </Screen>
    )
  }

  private renderList = () => {
    return (
      <ContentList
        ref={this.list}
        data={this.props.readerStore.followedList}
        creators={this.props.readerStore.creators}
        titleLabelTx="readerScreen.followingLabel"
        isLoading={this.props.readerStore.isFetchingFollowedList}
        isFetchingMore={this.props.readerStore.isFetchingMoreFollowedList}
        isGroupedByDay={true}
        hasFetched={this.props.readerStore.hasFetchedFollowedList}
        hasFetchedAll={this.props.readerStore.hasReachedEndOfFollowedList}
        lastFetched={this.props.readerStore.followedListLastFetchedDate.getTime()}
        onFetchMore={this.props.readerStore.fetchMoreFollowedList}
        onToggleBookmark={this.onBookmarkContentItem}
        onToggleFollow={this.onFollowContentItem}
        onPressUndoButton={this.onPressUndoButton}
        onPressItem={this.onPressContentItem}
        onRefresh={this.props.readerStore.fetchFollowingList}
        style={Style.List}
      />
    )
  }
}
