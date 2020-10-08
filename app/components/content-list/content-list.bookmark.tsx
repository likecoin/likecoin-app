import * as React from "react"
import { ListRenderItemInfo, RefreshControl, View } from "react-native"
import { observer } from "mobx-react"
import { RowMap, SwipeListView } from "react-native-swipe-list-view"

import { BookmarkedContentListProps as Props } from "./content-list.props"
import {
  ContentListStyle as Style,
  RefreshControlColors,
} from "./content-list.style"

import {
  BUTTON_BASE,
  BookmarkedContentListItem,
  BookmarkedContentListItemBack,
  ContentListItemSkeleton,
} from "../content-list-item"
import { Text } from "../text"

import { Content } from "../../models/content"

@observer
export class BookmarkedContentList extends React.Component<Props> {
  private rowOpenSet = new Set<string>()

  private keyExtractor = (content: Content) =>
    `${this.props.lastFetched}${content.url}`

  private handleRowOpen = (rowKey: string) => {
    this.rowOpenSet.add(rowKey)
  }

  private handleRowClose = (rowKey: string) => {
    this.rowOpenSet.delete(rowKey)
  }

  private onEndReach = (info: { distanceFromEnd: number }) => {
    if (this.props.onEndReached) this.props.onEndReached(info)
    if (
      this.props.onFetchMore &&
      this.props.hasFetched &&
      !this.props.hasFetchedAll
    ) {
      this.props.onFetchMore()
    }
  }

  private toggleItemBack = (rowMap: RowMap<Content>, rowKey: string) => {
    if (rowMap[rowKey]) {
      if (this.rowOpenSet.has(rowKey)) {
        rowMap[rowKey].closeRow()
      } else {
        rowMap[rowKey].manuallySwipeRow(-BUTTON_BASE.width * 2)
      }
    }
  }

  private renderRefreshControl = () => (
    <RefreshControl
      colors={RefreshControlColors}
      refreshing={this.props.hasFetched && this.props.isLoading}
      onRefresh={this.props.onRefresh}
    />
  )

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
        this.toggleItemBack(rowMap, this.keyExtractor(item))
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
          this.toggleItemBack(rowMap, this.keyExtractor(item))
        }
      />
    )
  }

  private renderEmpty = () => {
    if (this.props.hasFetched) {
      return (
        <View style={Style.Empty}>
          <Text tx="readerScreen.emptyLabel" style={Style.EmptyLabel} />
        </View>
      )
    }

    return (
      <View>
        {[...Array(7)].map((_, i) => (
          <ContentListItemSkeleton
            key={`${i}`}
            primaryColor={this.props.skeletonPrimaryColor}
            secondaryColor={this.props.skeletonSecondaryColor}
          />
        ))}
      </View>
    )
  }

  private renderFooter = () => {
    return this.props.isFetchingMore ? (
      <View style={Style.Footer}>
        <ContentListItemSkeleton
          primaryColor={this.props.skeletonPrimaryColor}
          secondaryColor={this.props.skeletonSecondaryColor}
        />
      </View>
    ) : null
  }

  render() {
    return (
      <SwipeListView<Content>
        data={this.props.data}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        renderHiddenItem={this.renderHiddenItem}
        rightOpenValue={-BUTTON_BASE.width * 2}
        disableRightSwipe={true}
        recalculateHiddenLayout={true}
        refreshControl={this.renderRefreshControl()}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        ListEmptyComponent={this.renderEmpty}
        ListFooterComponent={this.renderFooter}
        contentContainerStyle={this.props.data.length > 0 ? null : Style.Full}
        style={[Style.Full, this.props.style]}
        onRowOpen={this.handleRowOpen}
        onRowClose={this.handleRowClose}
        onEndReached={this.onEndReach}
        onEndReachedThreshold={this.props.onEndReachedThreshold}
        onScroll={this.props.onScroll}
      />
    )
  }
}
