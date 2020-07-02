import * as React from "react"
import { inject, observer } from "mobx-react"

import {
  ContentListScreenProps as Props,
} from "./content-list-screen.props"

import { Content } from "../../models/content"

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

    onPressUndoButton = (content: Content) => {
      const { likerID } = content.creator
      logAnalyticsEvent('UndoUnfollow', { likerID })
      this.props.readerStore.toggleFollow(likerID)
    }

    onToggleFollow = (content: Content) => {
      const { isFollowing, likerID } = content.creator
      if (isFollowing) {
        logAnalyticsEvent("UnfollowLiker", { likerID })
      } else {
        logAnalyticsEvent("FollowLiker", { likerID })
      }
      this.props.readerStore.toggleFollow(likerID)
    }

    onToggleBookmark = (url: string) => {
      this.props.readerStore.toggleBookmark(url)
    }

    render() {
      return (
        <ObservedComponent
          {...this.props as P}
          onPressContentItem={this.onPressContentItem}
          onPressUndoButton={this.onPressUndoButton}
          onToggleBookmark={this.onToggleBookmark}
          onToggleFollow={this.onToggleFollow}
        />
      )
    }
  }
  return ContentListScreen
}
