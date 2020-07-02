import * as React from "react"

import {
  GlobalSuperLikedFeedScreenProps as Props,
} from "./global-superliked-feed-screen.props"
import {
  GlobalSuperLikedFeedScreenStyle as Style,
} from "./global-superliked-feed-screen.style"

import {
  ContentList,
} from "../../components/content-list"
import {
  wrapContentListScreen,
} from "../../components/content-list-screen"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"

import { color } from "../../theme"

class GlobalSuperLikedFeedScreenBase extends React.Component<Props> {
  render() {
    return (
      <Screen
        style={Style.Root}
        preset="fixed"
      >
        <Header
          headerTx="GlobalSuperLikedFeedScreen.Title"
          leftIcon="back"
          onLeftPress={this.props.navigation.goBack}
        />
        {this.renderList()}
      </Screen>
    )
  }

  private renderList = () => {
    return (
      <ContentList
        data={this.props.readerStore.followedList}
        creators={this.props.readerStore.creators}
        isLoading={this.props.readerStore.isFetchingFollowedList}
        isFetchingMore={this.props.readerStore.isFetchingMoreFollowedList}
        hasFetched={this.props.readerStore.hasFetchedFollowedList}
        hasFetchedAll={this.props.readerStore.hasReachedEndOfFollowedList}
        lastFetched={this.props.readerStore.followedListLastFetchedDate.getTime()}
        backgroundColor={color.palette.lightGreen}
        underlayColor={color.palette.darkerGreen}
        skeletonPrimaryColor={color.palette.darkerGreen}
        skeletonSecondaryColor={color.palette.greyBlue}
        onFetchMore={this.props.readerStore.fetchMoreFollowedList}
        onPressUndoButton={this.props.onPressUndoButton}
        onPressItem={this.props.onPressContentItem}
        onToggleBookmark={this.props.onToggleBookmark}
        onToggleFollow={this.props.onToggleFollow}
        onRefresh={this.props.readerStore.fetchFollowingList}
        style={Style.List}
      />
    )
  }
}

export const GlobalSuperLikedFeedScreen = wrapContentListScreen(
  GlobalSuperLikedFeedScreenBase
)
