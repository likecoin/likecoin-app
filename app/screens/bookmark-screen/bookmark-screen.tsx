import * as React from "react"

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

class BookmarkScreenBase extends React.Component<Props> {
  componentDidMount() {
    if (!this.props.readerStore.hasFetchedBookmarkList) {
      this.props.readerStore.fetchBookmarkList()
    }
  }

  render() {
    return (
      <Screen
        style={Style.Screen}
        preset="fixed"
      >
        <Header headerTx="BookmarkScreen.title" />
        <ContentList
          data={this.props.readerStore.bookmarkList}
          creators={this.props.readerStore.creators}
          hasFetched={this.props.readerStore.hasFetchedBookmarkList}
          isLoading={this.props.readerStore.isFetchingBookmarkList}
          isShowBookmarkIcon={false}
          onPressItem={this.props.onPressContentItem}
          onToggleBookmark={this.props.onToggleBookmark}
          onToggleFollow={this.props.onToggleFollow}
          onRefresh={this.props.readerStore.fetchBookmarkList}
          style={Style.List}
        />
      </Screen>
    )
  }
}

export const BookmarkScreen = wrapContentListScreen(
  BookmarkScreenBase
)
