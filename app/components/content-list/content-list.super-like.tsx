import * as React from "react"
import { ListRenderItemInfo, RefreshControl, View } from "react-native"
import { observer } from "mobx-react"
import { RowMap, SwipeListView } from "react-native-swipe-list-view"

import { SuperLike } from "../../models/super-like"

import {
  BUTTON_BASE,
  ContentListItemSkeleton,
  SuperLikeContentListItem,
  SuperLikeContentListItemBack,
} from "../content-list-item"
import { Text } from "../text"

import {
  ContentListStyle as Style,
  RefreshControlColors,
} from "./content-list.style"
import { SuperLikeContentListProps as Props } from "./content-list.props"

@observer
export class SuperLikeContentList extends React.Component<Props> {
  private rowOpenSet = new Set<string>()

  private keyExtractor = (item: SuperLike) =>
    `${this.props.lastFetched}${item.id}`

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

  private toggleItemBack = (rowMap: RowMap<SuperLike>, rowKey: string) => {
    if (rowMap[rowKey]) {
      if (this.rowOpenSet.has(rowKey)) {
        rowMap[rowKey].closeRow()
      } else {
        rowMap[rowKey].manuallySwipeRow(-BUTTON_BASE.width * 2)
      }
    }
  }

  private renderRefreshControl = () =>
    this.props.onRefresh ? (
      <RefreshControl
        colors={RefreshControlColors}
        refreshing={this.props.hasFetched && this.props.isLoading}
        onRefresh={this.props.onRefresh}
      />
    ) : null

  private renderItem = (
    { item }: ListRenderItemInfo<SuperLike>,
    rowMap: RowMap<SuperLike>,
  ) => (
    <SuperLikeContentListItem
      item={item}
      isShowFollowToggle={this.props.isShowFollowToggle}
      backgroundColor={this.props.backgroundColor}
      underlayColor={this.props.underlayColor}
      skeletonPrimaryColor={this.props.skeletonPrimaryColor}
      skeletonSecondaryColor={this.props.skeletonSecondaryColor}
      onPress={this.props.onPressItem}
      onPressMoreButton={() =>
        this.toggleItemBack(rowMap, this.keyExtractor(item))
      }
      onPressUndoUnfollowButton={this.props.onPressUndoUnfollowButton}
      onToggleBookmark={this.props.onToggleBookmark}
      onToggleFollow={this.props.onToggleFollow}
    />
  )

  private renderHiddenItem = (
    { item }: ListRenderItemInfo<SuperLike>,
    rowMap: RowMap<SuperLike>,
  ) => {
    return (
      <SuperLikeContentListItemBack
        item={item}
        onTriggerAction={() =>
          this.toggleItemBack(rowMap, this.keyExtractor(item))
        }
        onToggleBookmark={this.props.onToggleBookmark}
        onToggleFollow={this.props.onToggleFollow}
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
      <SwipeListView<SuperLike>
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
