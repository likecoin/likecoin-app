import * as React from "react"
import { Animated, ListRenderItemInfo } from "react-native"
import { FlatList } from "react-navigation"
import { observer } from "mobx-react"

import { SuperLike } from "../../models/super-like"

import { SuperLikeContentListItem } from "../content-list-item"

import { withContentListHelper } from "./content-list.with-helper"
import { SuperLikeContentListProps as Props } from "./content-list.props"

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

@observer
class SuperLikeContentListBase extends React.Component<Props> {
  private keyExtractor = (item: SuperLike) =>
    `${this.props.lastFetched}${item.id}`

  private renderItem = (
    { item }: ListRenderItemInfo<SuperLike>,
  ) => (
    <SuperLikeContentListItem
      item={item}
      isShowFollowToggle={this.props.isShowFollowToggle}
      backgroundColor={this.props.backgroundColor}
      underlayColor={this.props.underlayColor}
      skeletonPrimaryColor={this.props.skeletonPrimaryColor}
      skeletonSecondaryColor={this.props.skeletonSecondaryColor}
      onPress={this.props.onPressItem}
      onPressUndoUnfollowButton={this.props.onPressUndoUnfollowButton}
      onToggleBookmark={this.props.onToggleBookmark}
      onToggleFollow={this.props.onToggleFollow}
    />
  )

  render() {
    return (
      <AnimatedFlatList<SuperLike>
        {...this.props.listViewProps}
        data={this.props.data}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
      />
    )
  }
}

export const SuperLikeContentList = withContentListHelper(
  SuperLikeContentListBase,
)
