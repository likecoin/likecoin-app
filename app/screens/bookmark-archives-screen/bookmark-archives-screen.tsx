import * as React from "react"
import { inject, observer } from "mobx-react"

import { logAnalyticsEvent } from "../../utils/analytics"

import { Content } from "../../models/content"

import { BookmarkedContentList } from "../../components/content-list"
import { wrapContentListScreen } from "../../components/content-list-screen"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"

import { BookmarkArchivesScreenProps as Props } from "./bookmark-archives-screen.props"
import { BookmarkArchivesScreenStyle as Style } from "./bookmark-archives-screen.style"

@inject("contentBookmarksListStore")
@observer
class BookmarkArchivesScreenBase extends React.Component<Props> {
  private onToggleBookmark = (content: Content) => {
    logAnalyticsEvent(
      `ArchivesList${content.isBookmarked ? "Remove" : "Add"}Bookmark`,
      { url: content.url },
    )
    if (this.props.onToggleBookmark) this.props.onToggleBookmark(content)
  }

  private onToggleArchive = (content: Content) => {
    logAnalyticsEvent(
      `ArchivesList${content.isArchived ? "Archive" : "Unarchive"}`,
      { url: content.url },
    )
    if (this.props.onToggleArchive) this.props.onToggleArchive(content)
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
        <BookmarkedContentList
          data={this.props.contentBookmarksListStore.contents.archives}
          hasFetched={status !== "idle"}
          isLoading={status === "pending"}
          isShowBookmarkIcon={false}
          onPressItem={this.props.onPressContentItem}
          onToggleArchive={this.onToggleArchive}
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
