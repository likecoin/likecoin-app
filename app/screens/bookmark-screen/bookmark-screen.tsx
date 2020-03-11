import * as React from "react"
import { inject, observer } from "mobx-react"

import { BookmarkScreenProps as Props } from "./bookmark-screen.props"
import { BookmarkScreenStyle as Style } from "./bookmark-screen.style"

import { Header } from "../../components/header"
import { ContentList } from "../../components/content-list"
import { Screen } from "../../components/screen"

import { Content } from "../../models/content"

@inject("readerStore")
@observer
export class BookmarkScreen extends React.Component<Props> {
  componentDidMount() {
    if (!this.props.readerStore.hasFetchedBookmarkList) {
      this.props.readerStore.fetchBookmarkList()
    }
  }

  private onToggleBookmark = (url: string) => {
    this.props.readerStore.toggleBookmark(url)
  }

  private onToggleFollow = (content: Content) => {
    this.props.readerStore.toggleFollow(content.creator.likerID)
  }

  private onPressContentItem = (id: string) => {
    const content = this.props.readerStore.contents.get(id)
    this.props.navigation.navigate('ContentView', { content })
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
          onPressItem={this.onPressContentItem}
          onToggleBookmark={this.onToggleBookmark}
          onToggleFollow={this.onToggleFollow}
          onRefresh={this.props.readerStore.fetchBookmarkList}
          style={Style.List}
        />
      </Screen>
    )
  }
}
