import * as React from "react"
import { observer } from "mobx-react"

import { ContentList } from "../../components/content-list"
import { wrapContentListScreen } from "../../components/content-list-screen"
import { Header } from "../../components/header"
import { Screen } from "../../components/screen"

import { ReaderScreenProps as Props } from "./content-following-screen.props"
import { ContentFollowingScreenStyle as Style } from "./content-following-screen.style"

@observer
export class ContentFollowingScreenBase extends React.Component<Props> {
  contentList = React.createRef<ContentList>()

  componentDidMount() {
    this.contentList.current.props.onRefresh()
  }

  public onResume = () => {
    this.contentList.current.props.onRefresh()
  }

  render() {
    return (
      <Screen style={Style.Root} preset="fixed">
        <Header headerTx="readerScreen.Title" />
        {this.renderList()}
      </Screen>
    )
  }

  private renderList = () => {
    return (
      <ContentList
        ref={this.contentList}
        data={this.props.readerStore.followedList}
        creators={this.props.readerStore.creators}
        isLoading={this.props.readerStore.isFetchingFollowedList}
        isFetchingMore={this.props.readerStore.isFetchingMoreFollowedList}
        hasFetched={this.props.readerStore.hasFetchedFollowedList}
        hasFetchedAll={this.props.readerStore.hasReachedEndOfFollowedList}
        lastFetched={this.props.readerStore.followedListLastFetchedDate.getTime()}
        onFetchMore={this.props.readerStore.fetchMoreFollowedList}
        onPressUndoUnfollowButton={this.props.onPressUndoUnfollowButton}
        onPressItem={this.props.onPressContentItem}
        onToggleBookmark={this.props.onToggleBookmark}
        onToggleFollow={this.props.onToggleFollow}
        onRefresh={this.props.readerStore.fetchFollowingList}
        style={Style.List}
      />
    )
  }
}

export const ContentFollowingScreen = wrapContentListScreen(
  ContentFollowingScreenBase,
)
