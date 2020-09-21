import * as React from "react"

import { logAnalyticsEvent } from "../../utils/analytics"

import { Content } from "../../models/content"
import { Creator } from "../../models/creator"
import { SuperLike } from "../../models/super-like"

import { ContentListScreenProps as Props } from "./content-list-screen.props"

export const wrapContentListScreen = <P extends Props>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return class ContentListScreen extends React.Component<P & Props> {
    onPressContentItem = (content: Content) => {
      logAnalyticsEvent("select_content", {
        contentType: "content",
        itemId: content.url,
      })
      logAnalyticsEvent("OpenArticle", { url: content.url })
      this.props.navigation.navigate("ContentView", { content })
    }

    onPressSuperLikeItem = (item: SuperLike) => {
      logAnalyticsEvent("select_content", {
        contentType: "content",
        itemId: item.content.url,
      })
      logAnalyticsEvent("OpenArticle", { url: item.content.url })
      this.props.navigation.navigate("ContentView", { superLike: item })
    }

    onPressUndoUnfollowButton = (creator: Creator) => {
      logAnalyticsEvent("UndoUnfollow", { likerID: creator.likerID })
      creator.follow()
    }

    onToggleFollow = (creator: Creator) => {
      const { isFollowing, likerID } = creator
      if (isFollowing) {
        logAnalyticsEvent("UnfollowLiker", { likerID })
        creator.unfollow()
      } else {
        logAnalyticsEvent("FollowLiker", { likerID })
        creator.follow()
      }
    }

    onToggleBookmark = (content: Content) => {
      if (!content.isBookmarked) {
        content.addBookmark()
      } else {
        content.removeBookmark()
      }
    }

    render() {
      return (
        <WrappedComponent
          {...(this.props as P)}
          onPressContentItem={this.onPressContentItem}
          onPressSuperLikeItem={this.onPressSuperLikeItem}
          onPressUndoUnfollowButton={this.onPressUndoUnfollowButton}
          onToggleBookmark={this.onToggleBookmark}
          onToggleFollow={this.onToggleFollow}
        />
      )
    }
  }
}
