import * as React from "react"
import { ListRenderItemInfo } from "react-native"
import { FlatList } from "react-navigation"
import { observer } from "mobx-react"

import { Content } from "../../models/content"

import { BookmarkedContentListItem } from "../content-list-item"

import { withContentListHelper } from "./content-list.with-helper"
import { BookmarkedContentListProps as Props } from "./content-list.props"

@observer
class BookmarkedContentListBase extends React.Component<Props> {
  private keyExtractor = (content: Content) =>
    `${this.props.lastFetched}${content.url}`

  private renderItem = (
    { item }: ListRenderItemInfo<Content>,
  ) => (
    <BookmarkedContentListItem
      item={item}
      backgroundColor={this.props.backgroundColor}
      underlayColor={this.props.underlayColor}
      skeletonPrimaryColor={this.props.skeletonPrimaryColor}
      skeletonSecondaryColor={this.props.skeletonSecondaryColor}
      onPress={this.props.onPressItem}
      onPressArchiveButton={this.props.onToggleArchive}
      onPressUndoRemoveBookmarkButton={this.props.onToggleBookmark}
      onToggleBookmark={this.props.onToggleBookmark}
      onToggleFollow={this.props.onToggleFollow}
    />
  )

  render() {
    return (
      <FlatList<Content>
        {...this.props.listViewProps}
        data={this.props.data}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
      />
    )
  }
}

export const BookmarkedContentList = withContentListHelper(
  BookmarkedContentListBase,
)
