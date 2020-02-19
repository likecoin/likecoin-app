import * as React from "react"
import { ViewStyle, Alert } from "react-native"
import { inject, observer } from "mobx-react"
import { connectActionSheet } from "@expo/react-native-action-sheet"

import { ReaderScreenProps as Props } from "./reader-screen.props"

import { Screen } from "../../components/screen"
import { ContentList } from "../../components/content-list"

import { color } from "../../theme"

import { logAnalyticsEvent } from "../../utils/analytics"
import { Content } from "../../models/content"
import { translate } from "../../i18n"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  ...FULL,
  alignItems: "stretch",
}

@inject("readerStore")
@observer
class ReaderScreenRaw extends React.Component<Props> {
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

  private onPressMoreButton = (content: Content) => {
    const { isFollowing } = content.creator
    const followButtonTitle = translate(isFollowing ? "common.unfollow" : "common.follow")
    const options = [
      followButtonTitle,
      translate("common.cancel"),
    ]
    this.props.showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      },
      async (buttonIndex: number) => {
        if (buttonIndex === 0) {
          const { likerID } = content.creator
          if (isFollowing) {
            logAnalyticsEvent('UnfollowLiker', { likerID })
            await this.props.readerStore.toggleFollow(likerID)
          } else {
            logAnalyticsEvent('FollowLiker', { likerID })
            await this.props.readerStore.toggleFollow(likerID)
          }

          // Notify follow status to user
          const { isFollowing: isFollowingNow } = content.creator
          if (
            // Follow status changes
            isFollowing !== isFollowingNow &&
            // Not include unfollow in following list
            !(
              !isFollowingNow &&
              this.props.navigation.state.routeName === "Following"
            )
          ) {
            Alert.alert(
              followButtonTitle,
              translate(
                isFollowingNow
                  ? "common.followSuccess"
                  : "common.unfollowSuccess",
                { creator: content.creator.displayName }
              ),
            )
          }
        }
      },
    )
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
    switch (this.props.navigation.state.routeName) {
      case "Featured":
        return (
          <ContentList
            ref={this.list}
            data={this.props.readerStore.featuredList}
            creators={this.props.readerStore.creators}
            titleLabelTx="readerScreen.featuredLabel"
            hasFetched={this.props.readerStore.hasFetchedFeaturedList}
            lastFetched={this.props.readerStore.featuredListLastFetchedDate.getTime()}
            isLoading={this.props.readerStore.isFetchingFeaturedList}
            onBookmarkItem={this.onBookmarkContentItem}
            onPressMoreButton={this.onPressMoreButton}
            onPressItem={this.onPressContentItem}
            onRefresh={this.props.readerStore.fetchFeaturedList}
          />
        )

      case "Following":
        return (
          <ContentList
            ref={this.list}
            data={this.props.readerStore.followedList}
            creators={this.props.readerStore.creators}
            titleLabelTx="readerScreen.followingLabel"
            isLoading={this.props.readerStore.isFetchingFollowedList}
            isFetchingMore={this.props.readerStore.isFetchingMoreFollowedList}
            hasFetched={this.props.readerStore.hasFetchedFollowedList}
            hasFetchedAll={this.props.readerStore.hasReachedEndOfFollowedList}
            lastFetched={this.props.readerStore.followedListLastFetchedDate.getTime()}
            onFetchMore={this.props.readerStore.fetchMoreFollowedList}
            onBookmarkItem={this.onBookmarkContentItem}
            onPressMoreButton={this.onPressMoreButton}
            onPressUndoButton={this.onPressUndoButton}
            onPressItem={this.onPressContentItem}
            onRefresh={this.props.readerStore.fetchFollowingList}
          />
        )
    }
    return null
  }
}

export const ReaderScreen = connectActionSheet(ReaderScreenRaw)
