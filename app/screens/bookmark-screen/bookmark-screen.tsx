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
  list = React.createRef<ContentList>()

  componentDidMount() {
    this.list.current.props.onRefresh()
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
          ref={this.list}
          data={this.props.readerStore.bookmarkList}
          creators={this.props.readerStore.creators}
          hasFetched={this.props.readerStore.hasFetchedBookmarkList}
          isLoading={this.props.readerStore.isFetchingBookmarkList}
          onPressItem={this.onPressContentItem}
          onBookmarkItem={this.onBookmarkContentItem}
          onRefresh={this.props.readerStore.fetchBookmarkList}
          style={Style.List}
        />
      </Screen>
    )
  }
}
