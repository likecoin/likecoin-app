import * as React from "react"
import {
  ActivityIndicator,
  ListRenderItem,
  RefreshControl,
  View,
  ViewStyle,
} from "react-native"
import { NavigationScreenProps, FlatList } from "react-navigation"
import { inject, observer } from "mobx-react"

import { ContentListItem } from "../../components/content-list-item"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"

import { color, spacing } from "../../theme"

import { ReaderStore } from "../../models/reader-store"
import { Content } from "../../models/content"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  ...FULL,
  alignItems: "stretch",
}
const LIST_HEADER: ViewStyle = {
  paddingTop: spacing[4],
}
const EMPTY_VIEW: ViewStyle = {
  ...FULL,
  justifyContent: "center",
  alignItems: "center",
}
const FOOTER_VIEW: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: spacing[4],
}

export interface ReaderScreenProps extends NavigationScreenProps<{}> {
  readerStore: ReaderStore,
}

@inject("readerStore")
@observer
export class ReaderScreen extends React.Component<ReaderScreenProps, {}> {
  componentDidMount() {
    this.fetchList()
  }

  private fetchList = () => {
    switch (this.props.navigation.state.routeName) {
      case 'Featured':
        this.props.readerStore.fetchSuggestList()
        break

      case 'Followed':
        this.props.readerStore.fetchFollowedList()
        break
    }
  }

  private onPressContentItem = (content: Content) => {
    this.props.navigation.navigate('ContentView', { content })
  }

  private onLoadMore = () => {
    console.tron.log("ONLOADMORE")
    if (
      this.props.navigation.state.routeName === "Followed" &&
      this.props.readerStore.hasFetchedFollowedList &&
      !this.props.readerStore.hasReachedEndOfFollowedList
    ) {
      this.props.readerStore.fetchMoreFollowedList()
    }
  }

  private renderContent: ListRenderItem<Content> = ({ item: content }) => {
    return (
      <ContentListItem
        content={content}
        onPressItem={this.onPressContentItem}
      />
    )
  }

  render() {
    const { readerStore } = this.props

    let contentList = []
    let titleLabelTx = ""
    let hasFetched = false
    switch (this.props.navigation.state.routeName) {
      case "Featured":
        contentList = readerStore.featuredList
        titleLabelTx = "readerScreen.featuredLabel"
        hasFetched = readerStore.hasFetchedSuggestList
        break
      case "Followed":
        contentList = readerStore.followedList
        titleLabelTx = "readerScreen.followingLabel"
        hasFetched = readerStore.hasFetchedFollowedList
        break
    }

    return (
      <Screen
        style={CONTAINER}
        preset="fixed"
        backgroundColor={color.palette.white}
        unsafe={true}
      >
        <FlatList<Content>
          data={contentList}
          keyExtractor={({ url }) => url}
          renderItem={this.renderContent}
          refreshControl={
            <RefreshControl
              tintColor={color.primary}
              colors={[color.primary]}
              refreshing={hasFetched && this.props.readerStore.isLoading}
              onRefresh={this.fetchList}
            />
          }
          ListEmptyComponent={this.renderEmpty}
          ListHeaderComponent={(
            <Text
              tx={titleLabelTx}
              color="likeGreen"
              align="center"
              weight="600"
              style={LIST_HEADER}
            />
          )}
          ListFooterComponent={this.renderFooter}
          contentContainerStyle={contentList.length > 0 ? null : FULL}
          style={FULL}
          onEndReached={this.onLoadMore}
        />
      </Screen>
    )
  }

  private renderEmpty = () => {
    const hasFetched = this.props.navigation.state.routeName === "Suggest" ? (
      this.props.readerStore.hasFetchedSuggestList
    ) : (
      this.props.readerStore.hasFetchedFollowedList
    )
    return (
      <View style={EMPTY_VIEW}>
        {hasFetched &&
          <Text
            tx="readerScreen.emptyLabel"
            color="grey9b"
            size="large"
            align="center"
            weight="600"
          />
        }
        {!hasFetched &&
          <ActivityIndicator
            color={color.primary}
            size="large"
          />
        }
      </View>
    )
  }

  private renderFooter = () => {
    return (
      <View style={FOOTER_VIEW}>
        {this.props.readerStore.isFetchingMoreFollowedList &&
          <ActivityIndicator
            color={color.primary}
            size="small"
          />
        }
      </View>
    )
  }
}
