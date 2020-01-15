import * as React from "react"
import {
  ListRenderItem,
  RefreshControl,
  View,
  ViewStyle,
} from "react-native"
import { FlatList } from 'react-navigation'
import { observer } from "mobx-react"

import { ContentListProps } from "./content-list.props"

import {
  ContentListItem,
  ContentListItemSkeleton,
} from "../content-list-item"
import { Text } from "../../components/text"

import { Content } from "../../models/content"

import { spacing, color } from "../../theme"

const FULL: ViewStyle = {
  flex: 1,
}
const HEADER: ViewStyle = {
  paddingTop: spacing[4],
}
const EMPTY: ViewStyle = {
  ...FULL,
  justifyContent: "center",
  alignItems: "center",
}
const FOOTER: ViewStyle = {
  paddingBottom: spacing[4],
}

@observer
export class ContentList extends React.Component<ContentListProps> {
  private keyExtractor = (content: Content) => `${this.props.lastFetched}${content.url}`

  private onEndReach = () => {
    if (
      this.props.onFetchMore &&
      this.props.hasFetched &&
      !this.props.hasFetchedAll
    ) {
      this.props.onFetchMore()
    }
  }

  render() {
    return (
      <FlatList<Content>
        data={this.props.data}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderContent}
        refreshControl={
          <RefreshControl
            colors={[color.primary]}
            refreshing={this.props.hasFetched && this.props.isLoading}
            onRefresh={this.props.onRefresh}
          />
        }
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        ListEmptyComponent={this.renderEmpty}
        ListHeaderComponent={(
          <Text
            tx={this.props.titleLabelTx}
            color="likeGreen"
            align="center"
            weight="600"
            style={HEADER}
          />
        )}
        ListFooterComponent={this.renderFooter}
        contentContainerStyle={this.props.data.length > 0 ? null : FULL}
        style={FULL}
        onEndReached={this.onEndReach}
      />
    )
  }

  private renderContent: ListRenderItem<Content> = ({ item: content }) => (
    <ContentListItem
      content={content}
      onPress={this.props.onPressItem}
    />
  )

  private renderEmpty = () => {
    if (this.props.hasFetched) {
      return (
        <View style={EMPTY}>
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
        {[...Array(7)].map((_, i) => <ContentListItemSkeleton key={`${i}`} />)}
      </View>
    )
  }

  private renderFooter = () => {
    return this.props.isFetchingMore ? (
      <View style={FOOTER}>
        <ContentListItemSkeleton />
      </View>
    ) : null
  }
}
