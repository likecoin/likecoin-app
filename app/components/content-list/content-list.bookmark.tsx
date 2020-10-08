import * as React from "react"
import { ListRenderItemInfo } from "react-native"
import { observer } from "mobx-react"
import { RowMap, SwipeListView } from "react-native-swipe-list-view"

import { Content } from "../../models/content"

import {
  BookmarkedContentListItem,
  BookmarkedContentListItemBack,
} from "../content-list-item"

import { withContentListHelper } from "./content-list.with-helper"
import { BookmarkedContentListProps as Props } from "./content-list.props"

@observer
class BookmarkedContentListBase extends React.Component<Props> {
  private keyExtractor = (content: Content) =>
    `${this.props.lastFetched}${content.url}`

  private renderItem = (
    { item }: ListRenderItemInfo<Content>,
    rowMap: RowMap<Content>,
  ) => (
    <BookmarkedContentListItem
      item={item}
      backgroundColor={this.props.backgroundColor}
      underlayColor={this.props.underlayColor}
      skeletonPrimaryColor={this.props.skeletonPrimaryColor}
      skeletonSecondaryColor={this.props.skeletonSecondaryColor}
      onPress={this.props.onPressItem}
      onPressMoreButton={() =>
        this.props.toggleItemBack(rowMap, this.keyExtractor(item))
      }
      onPressArchiveButton={this.props.onToggleArchive}
      onPressUndoRemoveBookmarkButton={this.props.onToggleBookmark}
      onToggleBookmark={this.props.onToggleBookmark}
      onToggleFollow={this.props.onToggleFollow}
    />
  )

  private renderHiddenItem = (
    { item }: ListRenderItemInfo<Content>,
    rowMap: RowMap<Content>,
  ) => {
    return (
      <BookmarkedContentListItemBack
        item={item}
        onRemove={this.props.onToggleBookmark}
        onToggleArchive={this.props.onToggleArchive}
        onTriggerAction={() =>
          this.props.toggleItemBack(rowMap, this.keyExtractor(item))
        }
      />
    )
  }

  render() {
    return (
      <SwipeListView<Content>
        {...this.props.listViewProps}
        data={this.props.data}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        renderHiddenItem={this.renderHiddenItem}
      />
    )
  }
}

export const BookmarkedContentList = withContentListHelper(
  BookmarkedContentListBase,
)
