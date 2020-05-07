import * as React from "react"
import { ViewStyle } from "react-native"
import { reaction } from "mobx"
import { inject, observer } from "mobx-react"

import { ReaderScreenProps as Props } from "./reader-screen.props"

import { Screen } from "../../components/screen"
import { ContentList } from "../../components/content-list"

import { Content } from "../../models/content"

import { color } from "../../theme"

import { logAnalyticsEvent } from "../../utils/analytics"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  ...FULL,
  alignItems: "stretch",
}

@inject("readerStore")
@observer
export class ReaderScreen extends React.Component<Props> {
  list = React.createRef<ContentList>()

  componentDidMount() {
    this.list.current.props.onRefresh()
    this.props.readerStore.fetchCreatorList()
    this.props.readerStore.fetchBookmarkList()

    // Automatically switch to following list if the user has followees
    if (this.props.navigation.state.routeName !== "Following") {
      reaction(
        () => this.props.readerStore.hasFetchedCreatorList,
        (hasFetchedCreatorList, r) => {
          if (hasFetchedCreatorList) {
            r.dispose()
            if (
              this.props.readerStore.followingCreators.length > 0 &&
              this.props.navigation.state.routeName !== "Following"
            ) {
              this.props.navigation.navigate("Following")
            }
          }
        }
      )
    }
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
        style={CONTAINER}
        preset="fixed"
        backgroundColor={color.palette.white}
        unsafe={true}
      >
        {this.renderList()}
      </Screen>
    )
  }

  private renderList = () => {
    const {
      featuredList,
      followedList,
      hasFetchedCreatorList,
      hasFetchedFeaturedList,
      hasFetchedFollowedList,
    } = this.props.readerStore
    switch (this.props.navigation.state.routeName) {
      case "Featured":
        return (
          <ContentList
            ref={this.list}
            data={hasFetchedCreatorList ? featuredList : []}
            creators={this.props.readerStore.creators}
            titleLabelTx="readerScreen.featuredLabel"
            hasFetched={hasFetchedFeaturedList && hasFetchedCreatorList}
            lastFetched={this.props.readerStore.featuredListLastFetchedDate.getTime()}
            isLoading={this.props.readerStore.isFetchingFeaturedList}
            onToggleBookmark={this.onBookmarkContentItem}
            onToggleFollow={this.onFollowContentItem}
            onPressItem={this.onPressContentItem}
            onRefresh={this.props.readerStore.fetchFeaturedList}
          />
        )

      case "Following":
        return (
          <ContentList
            ref={this.list}
            data={hasFetchedCreatorList ? followedList : []}
            creators={this.props.readerStore.creators}
            titleLabelTx="readerScreen.followingLabel"
            isLoading={this.props.readerStore.isFetchingFollowedList}
            isFetchingMore={this.props.readerStore.isFetchingMoreFollowedList}
            hasFetched={hasFetchedFollowedList && hasFetchedCreatorList}
            hasFetchedAll={this.props.readerStore.hasReachedEndOfFollowedList}
            lastFetched={this.props.readerStore.followedListLastFetchedDate.getTime()}
            onFetchMore={this.props.readerStore.fetchMoreFollowedList}
            onToggleBookmark={this.onBookmarkContentItem}
            onToggleFollow={this.onFollowContentItem}
            onPressUndoButton={this.onPressUndoButton}
            onPressItem={this.onPressContentItem}
            onRefresh={this.props.readerStore.fetchFollowingList}
          />
        )
    }
    return null
  }
}
