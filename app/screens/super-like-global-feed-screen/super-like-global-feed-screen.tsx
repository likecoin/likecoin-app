import * as React from "react"
import { observer, inject } from "mobx-react"
import styled from "styled-components/native"

import { color } from "../../theme"
import { logAnalyticsEvent } from "../../utils/analytics"

import { Content } from "../../models/content"

import { SuperLikeContentList as SuperLikeContentListBase } from "../../components/content-list"
import { wrapContentListScreen } from "../../components/content-list-screen"

import { SuperLikeGlobalFeedScreenProps as Props } from "./super-like-global-feed-screen.props"

const SuperLikeContentList = styled(SuperLikeContentListBase)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.secondary};
`

@inject("superLikeGlobalStore")
@observer
class SuperLikeGlobalFeedScreenBase extends React.Component<Props> {
  componentDidMount() {
    this.fetch()
  }

  private fetch = () => {
    this.props.superLikeGlobalStore.fetch()
  }

  private fetchMore = () => {
    this.props.superLikeGlobalStore.fetchMore()
  }

  private onToggleBookmark = (content: Content) => {
    if (this.props.onToggleBookmark) this.props.onToggleBookmark(content)
    logAnalyticsEvent(
      `SLGlobalFeed${content.isBookmarked ? "Remove" : "Add"}Bookmark`,
      { url: content.url },
    )
  }

  render() {
    const { status, lastFetchedTimestamp } = this.props.superLikeGlobalStore
    return (
      <SuperLikeContentList
        data={this.props.superLikeGlobalStore.items}
        isLoading={status === "pending"}
        isFetchingMore={status === "pending-more"}
        hasFetched={status === "done"}
        hasFetchedAll={status === "done-more"}
        emptyTx="GlobalSuperLikedFeedScreen.EmptyLabel"
        lastFetched={lastFetchedTimestamp}
        backgroundColor={color.palette.greyf2}
        underlayColor={color.palette.offWhite}
        skeletonPrimaryColor={color.palette.greyd8}
        skeletonSecondaryColor={color.palette.grey9b}
        isShowFollowToggle={true}
        listViewProps={this.props.listViewProps}
        onFetchMore={this.fetchMore}
        onPressItem={this.props.onPressSuperLikeItem}
        onToggleBookmark={this.onToggleBookmark}
        onToggleFollow={this.props.onToggleFollow}
        onRefresh={this.fetch}
        onScroll={this.props.onScroll}
      />
    )
  }
}

export const SuperLikeGlobalFeedScreen = wrapContentListScreen(
  SuperLikeGlobalFeedScreenBase,
)
