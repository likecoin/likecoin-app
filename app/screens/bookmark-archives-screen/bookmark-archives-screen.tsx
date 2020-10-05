import * as React from "react"
import { inject, observer } from "mobx-react"

import { logAnalyticsEvent } from "../../utils/analytics"

import { Content } from "../../models/content"

import { ContentList } from "../../components/content-list"
import { wrapContentListScreen } from "../../components/content-list-screen"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"

import { BookmarkArchivesScreenProps as Props } from "./bookmark-archives-screen.props"
import { BookmarkArchivesScreenStyle as Style } from "./bookmark-archives-screen.style"

@inject("contentBookmarksListStore")
@observer
class BookmarkArchivesScreenBase extends React.Component<Props> {
  private onToggleBookmark = (content: Content) => {
    if (this.props.onToggleBookmark) this.props.onToggleBookmark(content)
    logAnalyticsEvent(
      `ArchivesList${content.isBookmarked ? "Remove" : "Add"}Bookmark`,
      { url: content.url },
    )
  }

  private onPressBackButton = () => {
    this.props.navigation.goBack()
  }

  render() {
    const { status } = this.props.contentBookmarksListStore
    return (
      <Screen style={Style.Screen} preset="fixed">
        <Header
          headerTx="BookmarkArchivesScreen.Title"
          leftIcon="back"
          onLeftPress={this.onPressBackButton}
        />
        <ContentList
          data={this.props.contentBookmarksListStore.contents.archives}
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

export const BookmarkArchivesScreen = wrapContentListScreen(
  BookmarkArchivesScreenBase,
)
