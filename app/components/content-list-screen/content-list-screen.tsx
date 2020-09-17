import * as React from "react"
import { inject, observer } from "mobx-react"

import {
  ContentListScreenProps as Props,
} from "./content-list-screen.props"

import { Content } from "../../models/content"
import { Creator } from "../../models/creator"
import { SuperLike } from "../../models/super-like"

import { logAnalyticsEvent } from "../../utils/analytics"

export const wrapContentListScreen = <P extends Props>(WrappedComponent: React.ComponentType<P>) => {
  const ObservedComponent = observer(WrappedComponent)

  @inject("readerStore")
  class ContentListScreen extends React.Component<P & Props> {
    onPressContentItem = (url: string) => {
      const content = this.props.readerStore.contents.get(url)
      logAnalyticsEvent('select_content', { contentType: 'content', itemId: url })
      logAnalyticsEvent('OpenArticle', { url })
      this.props.navigation.navigate('ContentView', { content })
    }

    onPressSuperLikeItem = (item: SuperLike) => {
      logAnalyticsEvent('select_content', { contentType: 'content', itemId: item.content.url })
      logAnalyticsEvent('OpenArticle', { url: item.content.url })
      this.props.navigation.navigate('ContentView', { superLike: item })
    }

    onPressUndoUnfollowButton = (creator: Creator) => {
      logAnalyticsEvent('UndoUnfollow', { likerID: creator.likerID })
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
      this.props.readerStore.toggleBookmark(content.url)
    }

    render() {
      return (
        <ObservedComponent
          {...this.props as P}
          onPressContentItem={this.onPressContentItem}
          onPressSuperLikeItem={this.onPressSuperLikeItem}
          onPressUndoUnfollowButton={this.onPressUndoUnfollowButton}
          onToggleBookmark={this.onToggleBookmark}
          onToggleFollow={this.onToggleFollow}
        />
      )
    }
  }
  return ContentListScreen
}
