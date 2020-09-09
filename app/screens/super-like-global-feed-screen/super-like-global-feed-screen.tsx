import * as React from "react"
import { observer, inject } from "mobx-react"

import { color } from "../../theme"
import { logAnalyticsEvent } from "../../utils/analytics"

import { Content } from "../../models/content"

import { SuperLikeContentList } from "../../components/content-list"
import { wrapContentListScreen } from "../../components/content-list-screen"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"

import { SuperLikeGlobalFeedScreenProps as Props } from "./super-like-global-feed-screen.props"
import { SuperLikeGlobalFeedScreenStyle as Style } from "./super-like-global-feed-screen.style"

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

  private goBack = () => {
    this.props.navigation.goBack()
  }

  private onToggleBookmark = (content: Content) => {
    if (this.props.onToggleBookmark) this.props.onToggleBookmark(content)
    logAnalyticsEvent(
      `SLGlobalFeed${content.isBookmarked ? "Remove" : "Add"}Bookmark`,
      { url: content.url },
    )
  }

  render() {
    return (
      <Screen style={Style.Root} preset="fixed">
        <Header
          headerTx="GlobalSuperLikedFeedScreen.Title"
          leftIcon="back"
          onLeftPress={this.goBack}
        />
        {this.renderList()}
      </Screen>
    )
  }

  private renderList = () => {
    const { status, lastFetchedTimestamp } = this.props.superLikeGlobalStore
    return (
      <SuperLikeContentList
        data={this.props.superLikeGlobalStore.items}
        creators={this.props.readerStore.creators}
        isLoading={status === "pending"}
        isFetchingMore={status === "pending-more"}
        hasFetched={status === "done"}
        hasFetchedAll={status === "done-more"}
        lastFetched={lastFetchedTimestamp}
        backgroundColor={color.palette.lightGreen}
        underlayColor={color.palette.darkerGreen}
        skeletonPrimaryColor={color.palette.darkerGreen}
        skeletonSecondaryColor={color.palette.greyBlue}
        isShowFollowToggle={true}
        onFetchMore={this.fetchMore}
        onPressItem={this.props.onPressSuperLikeItem}
        onToggleBookmark={this.onToggleBookmark}
        onToggleFollow={this.props.onToggleFollow}
        onRefresh={this.fetch}
        style={Style.List}
      />
    )
  }
}

export const SuperLikeGlobalFeedScreen = wrapContentListScreen(
  SuperLikeGlobalFeedScreenBase,
)
