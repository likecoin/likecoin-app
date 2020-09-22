import * as React from "react"
import { inject, observer } from "mobx-react"

import { logAnalyticsEvent } from "../../utils/analytics"

import { Content } from "../../models/content"

import {
  BookmarkScreenProps as Props,
} from "./bookmark-screen.props"
import {
  BookmarkScreenStyle as Style,
} from "./bookmark-screen.style"

import { ContentList } from "../../components/content-list"
import {
  wrapContentListScreen,
} from "../../components/content-list-screen"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"

@inject("contentBookmarksListStore")
@observer
class BookmarkScreenBase extends React.Component<Props> {
  componentDidMount() {
    if (this.props.contentBookmarksListStore.status === "idle") {
      this.props.contentBookmarksListStore.fetch()
    }
  }

  private onToggleBookmark = (content: Content) => {
    if (this.props.onToggleBookmark) this.props.onToggleBookmark(content)
    logAnalyticsEvent(
      `BookmarkList${content.isBookmarked ? "Remove" : "Add"}Bookmark`,
      { url: content.url },
    )
  }

  render() {
    const { status } = this.props.contentBookmarksListStore
    return (
      <Screen
        style={Style.Screen}
        preset="fixed"
      >
        <Header headerTx="BookmarkScreen.title" />
        <ContentList
          data={this.props.contentBookmarksListStore.contents}
          hasFetched={status !== "idle"}
          isLoading={status === "pending"}
          isShowBookmarkIcon={false}
          onPressItem={this.props.onPressContentItem}
          onToggleBookmark={this.onToggleBookmark}
          onToggleFollow={this.props.onToggleFollow}
          onRefresh={this.props.contentBookmarksListStore.fetch}
          style={Style.List}
        />
      </Screen>
    )
  }
}

export const BookmarkScreen = wrapContentListScreen(
  BookmarkScreenBase
)
