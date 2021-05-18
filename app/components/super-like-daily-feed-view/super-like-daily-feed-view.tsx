import * as React from "react"
import { observer } from "mobx-react"

import { color } from "../../theme"

import { SuperLikeContentList } from "../../components/content-list"

import { wrapScrollViewShadow } from "../wrap-scrollview-shadow"

import { SuperLikeDailyFeedViewProps } from "./super-like-daily-feed-view.props"

const WrappedSuperLikeContentList = wrapScrollViewShadow(SuperLikeContentList)

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
      <WrappedSuperLikeContentList
        data={feed.items}
        emptyTx="readerScreen.emptyLabel"
        backgroundColor={color.palette.greyf7}
        underlayColor={color.palette.greyf2}
        isLoading={feed.isFetching}
        hasFetched={!feed.isFetching}
        hasFetchedAll={feed.hasFetchedAll()}
        onPressUndoUnfollowButton={this.props.onPressUndoUnfollowButton}
        onPressItem={this.props.onPressItem}
        onToggleBookmark={this.props.onToggleBookmark}
        onToggleFollow={this.props.onToggleFollow}
        style={this.props.style}
      />
    )
  }
}
