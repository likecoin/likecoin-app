import * as React from "react"
import { inject, observer } from "mobx-react"

import { BookmarkScreenProps as Props } from "./bookmark-screen.props"
import { BookmarkScreenStyle as Style } from "./bookmark-screen.style"

import { Header } from "../../components/header"
import { ContentList } from "../../components/content-list"
import { Screen } from "../../components/screen"

@inject("readerStore")
@observer
export class BookmarkScreen extends React.Component<Props> {
  componentDidMount() {
    if (!this.props.readerStore.hasFetchedBookmarkList) {
      this.props.readerStore.fetchBookmarkList()
    }
  }

  private onBookmarkContentItem = (url: string) => {
    this.props.readerStore.toggleBookmark(url)
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
          onBookmarkItem={this.onBookmarkContentItem}
          onRefresh={this.props.readerStore.fetchBookmarkList}
          style={Style.List}
        />
      </Screen>
    )
  }
}
