import * as React from "react"
import { ListRenderItemInfo } from "react-native"
import { observer } from "mobx-react"
import { RowMap, SwipeListView } from "react-native-swipe-list-view"

import { SuperLike } from "../../models/super-like"

import {
  SuperLikeContentListItem,
  SuperLikeContentListItemBack,
} from "../content-list-item"

import { withContentListHelper } from "./content-list.with-helper"
import { SuperLikeContentListProps as Props } from "./content-list.props"

@observer
class SuperLikeContentListBase extends React.Component<Props> {
  private keyExtractor = (item: SuperLike) =>
    `${this.props.lastFetched}${item.id}`

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
        this.props.toggleItemBack(rowMap, this.keyExtractor(item))
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
          this.props.toggleItemBack(rowMap, this.keyExtractor(item))
        }
        onToggleBookmark={this.props.onToggleBookmark}
        onToggleFollow={this.props.onToggleFollow}
      />
    )
  }

  render() {
    return (
      <SwipeListView<SuperLike>
        {...this.props.listViewProps}
        data={this.props.data}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        renderHiddenItem={this.renderHiddenItem}
      />
    )
  }
}

export const SuperLikeContentList = withContentListHelper(
  SuperLikeContentListBase,
)
