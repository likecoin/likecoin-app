import * as React from "react"
import { observer, inject } from "mobx-react"
import styled from "styled-components/native"

import { color } from "../../theme"
import { logAnalyticsEvent } from "../../utils/analytics"

import { Content } from "../../models/content"

import { wrapContentListScreen } from "../../components/content-list-screen"
import { SuperLikeContentList as SuperLikeContentListBase } from "../../components/content-list"

import { SuperLikeFollowingScreenProps as Props } from "./super-like-following-screen.props"

const SuperLikeContentList = styled(SuperLikeContentListBase)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.secondary};
`

@inject("superLikeFollowingStore")
@observer
export class SuperLikeFollowingScreenBase extends React.Component<Props, {}> {
  componentDidMount() {
    this.fetch()
  }

  public onResume = () => {
    this.fetch()
  }

  private fetch = () => {
    this.props.superLikeFollowingStore.fetch()
  }

  private fetchMore = () => {
    this.props.superLikeFollowingStore.fetchMore()
  }

  private onToggleBookmark = (content: Content) => {
    if (this.props.onToggleBookmark) this.props.onToggleBookmark(content)
    logAnalyticsEvent(
      `SLFollowingFeed${content.isBookmarked ? "Remove" : "Add"}Bookmark`,
      { url: content.url },
    )
  }

  render() {
    const { status, lastFetchedTimestamp } = this.props.superLikeFollowingStore
    return (
      <SuperLikeContentList
        data={this.props.superLikeFollowingStore.items}
        isLoading={status === "pending"}
        isFetchingMore={status === "pending-more"}
        hasFetched={status === "done"}
        hasFetchedAll={status === "done-more"}
        emptyTx="readerScreen.emptyLabel"
        headerTx="super_like_following_feed_screen_header_text"
        lastFetched={lastFetchedTimestamp}
        backgroundColor={color.palette.greyf2}
        underlayColor={color.palette.offWhite}
        skeletonPrimaryColor={color.palette.greyd8}
        skeletonSecondaryColor={color.palette.grey9b}
        listViewProps={this.props.listViewProps}
        onFetchMore={this.fetchMore}
        onPressUndoUnfollowButton={this.props.onPressUndoUnfollowButton}
        onPressItem={this.props.onPressSuperLikeItem}
        onToggleBookmark={this.onToggleBookmark}
        onToggleFollow={this.props.onToggleFollow}
        onScroll={this.props.onScroll}
      />
    )
  }
}

export const SuperLikeFollowingScreen = wrapContentListScreen(
  SuperLikeFollowingScreenBase,
)
