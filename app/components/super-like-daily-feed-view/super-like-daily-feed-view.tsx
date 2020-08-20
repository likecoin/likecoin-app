import * as React from "react"
import { observer } from "mobx-react"

import { SuperLikeContentList } from "../../components/content-list"

import { SuperLikeDailyFeedViewProps } from "./super-like-daily-feed-view.props"

@observer
export class SuperLikeDailyFeedView extends React.Component<
  SuperLikeDailyFeedViewProps,
  {}
> {
  componentDidMount() {
    this.props.feed.fetch()
  }

  render() {
    const { feed } = this.props
    return (
      <SuperLikeContentList
        data={feed.items}
        isLoading={feed.isFetching}
        hasFetched={!!feed.items.length}
        hasFetchedAll={feed.hasFetchedAll}
        onPressUndoUnfollowButton={this.props.onPressUndoUnfollowButton}
        onPressItem={this.props.onPressItem}
        onToggleBookmark={this.props.onToggleBookmark}
        onToggleFollow={this.props.onToggleFollow}
        style={this.props.style}
      />
    )
  }
}
