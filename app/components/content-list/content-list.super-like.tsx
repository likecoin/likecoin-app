import * as React from "react"
import { Animated, ListRenderItemInfo } from "react-native"
import { FlatList } from "react-navigation"
import { observer } from "mobx-react"
import styled from "styled-components/native"

import { SuperLike } from "../../models/super-like"

import { SuperLikeContentListItem } from "../content-list-item"
import { Icon } from "../icon"
import { Text } from "../text"

import { withContentListHelper } from "./content-list.with-helper"
import { SuperLikeContentListProps as Props } from "./content-list.props"

const AnimatedFlatList = styled(Animated.createAnimatedComponent(FlatList))`
  background-color: ${props => props.backgroundColor};
`

const HeaderView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-height: 80px;
`

const HeaderIcon = styled(Icon)`
  width: 24pxs;
  height: 24px;
  margin-right: ${({ theme }) => theme.spacing.md};
`

const HeaderText = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  font-size: ${({ theme }) => theme.text.size.sm};
  line-height: ${({ theme }) => theme.text.size.md};
  max-width: 33%;
`

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
      <AnimatedFlatList
        {...this.props.listViewProps}
        data={this.props.data}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        backgroundColor={this.props.backgroundColor}
        ListHeaderComponent={!!this.props.headerTx && (
          <HeaderView>
            <HeaderIcon
              name="super-like"
              color="grey9b"
            />
            <HeaderText tx={this.props.headerTx} />
          </HeaderView>
        )}
      />
    )
  }
}

export const SuperLikeContentList = withContentListHelper(
  SuperLikeContentListBase,
)
