import * as React from "react"
import { View } from "react-native"
import { inject, observer } from "mobx-react"

import { logAnalyticsEvent } from "../../utils/analytics"

import { Content } from "../../models/content"

import { Button } from "../../components/button"
import { ContentList } from "../../components/content-list"
import { wrapContentListScreen } from "../../components/content-list-screen"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"
import { wrapScrollViewShadow } from "../../components/wrap-scrollview-shadow"

import { BookmarkScreenProps as Props } from "./bookmark-screen.props"
import { BookmarkScreenStyle as Style } from "./bookmark-screen.style"

const BookmarkContentList = wrapScrollViewShadow(ContentList)

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

  private onPressArchivesListButton = () => {
    this.props.navigation.navigate("BookmarkArchives")
    logAnalyticsEvent("BookmarkListClickArchivesList")
  }

  private renderHeader = () => {
    return (
      <Header
        rightView={
          <Button
            preset="secondary"
            icon="archive"
            size="small"
            onPress={this.onPressArchivesListButton}
          />
        }
        style={Style.Header}
      >
        <View style={Style.HeaderMiddleView}>
          <Text tx="BookmarkScreen.Title" style={Style.Title} />
        </View>
      </Header>
    )
  }

  private renderList = () => {
    const { status } = this.props.contentBookmarksListStore
    return (
      <BookmarkContentList
        data={this.props.contentBookmarksListStore.contents.bookmarks}
        hasFetched={status !== "idle"}
        isLoading={status === "pending"}
        isShowBookmarkIcon={false}
        onPressItem={this.props.onPressContentItem}
        onToggleBookmark={this.onToggleBookmark}
        onToggleFollow={this.props.onToggleFollow}
        onRefresh={this.props.contentBookmarksListStore.fetch}
        style={Style.List}
      />
    )
  }

  render() {
    return (
      <Screen style={Style.Screen} preset="fixed">
        <View style={Style.ContentWrapper}>
          {this.renderHeader()}
          {this.renderList()}
        </View>
      </Screen>
    )
  }
}

export const BookmarkScreen = wrapContentListScreen(BookmarkScreenBase)
