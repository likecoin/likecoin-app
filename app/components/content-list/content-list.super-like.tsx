import * as React from "react"
import { ListRenderItem, RefreshControl, SectionListStatic, View } from "react-native"
import { FlatList, SectionList as SectionListBase } from "react-navigation"
import { observer } from "mobx-react"
import { SwipeRow } from "react-native-swipe-list-view"

import { SuperLikedContentListProps as Props } from "./content-list.props"
import { ContentListStyle as Style, RefreshControlColors } from "./content-list.style"

import { ContentListItemSkeleton, SuperLikeContentListItem } from "../content-list-item"
import { wrapScrollViewShadow } from "../wrap-scrollview-shadow"
import { Text } from "../text"

import { SuperLike } from "../../models/super-like"

const ContentSectionList: SectionListStatic<SuperLike> = SectionListBase

@observer
class SuperLikeContentListBase extends React.Component<Props> {
  listItemRefs = {} as { [key: string]: React.RefObject<SwipeRow<{}>> }

  private keyExtractor = (content: SuperLike) => `${this.props.lastFetched}${content.id}`

  private onEndReach = (info: { distanceFromEnd: number }) => {
    if (this.props.onEndReached) this.props.onEndReached(info)
    if (this.props.onFetchMore && this.props.hasFetched && !this.props.hasFetchedAll) {
      this.props.onFetchMore()
    }
  }

  private onItemSwipeOpen = (key: string, ref: React.RefObject<SwipeRow<{}>>) => {
    Object.keys(this.listItemRefs).forEach((refKey: string) => {
      if (refKey !== key) {
        this.listItemRefs[refKey].current.closeRow()
      }
    })
    this.listItemRefs[key] = ref
  }

  private onItemSwipeClose = (key: string) => {
    delete this.listItemRefs[key]
  }

  private onScrollBeginDrag = () => {
    Object.keys(this.listItemRefs).forEach((refKey: string) => {
      this.listItemRefs[refKey].current.closeRow()
    })
  }

  render() {
    if (this.props.sections) {
      return this.renderSections()
    }
    return (
      <FlatList<SuperLike>
        data={this.props.data}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderContent}
        refreshControl={this.renderRefreshControl()}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        ListEmptyComponent={this.renderEmpty}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
        contentContainerStyle={this.props.data.length > 0 ? null : Style.Full}
        style={[Style.Full, this.props.style]}
        onScroll={this.props.onScroll}
        onEndReached={this.onEndReach}
        onEndReachedThreshold={this.props.onEndReachedThreshold}
        onScrollBeginDrag={this.onScrollBeginDrag}
      />
    )
  }

  private renderSections() {
    return (
      <ContentSectionList
        sections={this.props.sections}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderContent}
        renderSectionHeader={this.props.renderSectionHeader}
        refreshControl={this.renderRefreshControl()}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        ListEmptyComponent={this.renderEmpty}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
        contentContainerStyle={this.props.sections.length > 0 ? null : Style.Full}
        style={[Style.Full, this.props.style]}
        stickySectionHeadersEnabled={false}
        onScroll={this.props.onScroll}
        onEndReached={this.onEndReach}
        onEndReachedThreshold={this.props.onEndReachedThreshold}
        onScrollBeginDrag={this.onScrollBeginDrag}
      />
    )
  }

  private renderHeader = () =>
    this.props.titleLabelTx ? (
      <Text
        tx={this.props.titleLabelTx}
        color="likeGreen"
        align="center"
        weight="600"
        style={Style.Header}
      />
    ) : null

  private renderRefreshControl = () =>
    this.props.onRefresh ? (
      <RefreshControl
        colors={RefreshControlColors}
        refreshing={this.props.hasFetched && this.props.isLoading}
        onRefresh={this.props.onRefresh}
      />
    ) : null

  private renderContent: ListRenderItem<SuperLike> = ({ item: content }) => (
    <SuperLikeContentListItem
      content={content}
      isShowBookmarkIcon={this.props.isShowBookmarkIcon}
      isShowFollowToggle={this.props.isShowFollowToggle}
      backgroundColor={this.props.backgroundColor}
      underlayColor={this.props.underlayColor}
      skeletonPrimaryColor={this.props.skeletonPrimaryColor}
      skeletonSecondaryColor={this.props.skeletonSecondaryColor}
      onToggleBookmark={this.props.onToggleBookmark}
      onToggleFollow={this.props.onToggleFollow}
      onPress={this.props.onPressItem}
      onPressUndoUnfollowButton={this.props.onPressUndoUnfollowButton}
      onSwipeOpen={this.onItemSwipeOpen}
      onSwipeClose={this.onItemSwipeClose}
    />
  )

  private renderEmpty = () => {
    if (this.props.hasFetched) {
      return (
        <View style={Style.Empty}>
          <Text
            tx="readerScreen.emptyLabel"
            color="grey9b"
            size="large"
            align="center"
            weight="600"
          />
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
}

export const SuperLikeContentList = wrapScrollViewShadow(SuperLikeContentListBase)
