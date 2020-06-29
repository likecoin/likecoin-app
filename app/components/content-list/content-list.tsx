import * as React from "react"
import {
  ListRenderItem,
  RefreshControl,
  SectionListStatic,
  View,
} from "react-native"
import {
  FlatList,
  SectionList as SectionListBase,
} from 'react-navigation'
import { observer } from "mobx-react"
import { SwipeRow } from "react-native-swipe-list-view"
import moment from "moment"

import {
  ContentListProps as Props,
  ContentSectionListData,
} from "./content-list.props"
import {
  ContentListStyle as Style,
  RefreshControlColors,
} from "./content-list.style"
import {
  ContentListSectionHeader,
} from "./content-list.section-header"

import {
  ContentListItem,
  ContentListItemSkeleton,
} from "../content-list-item"
import { Text } from "../../components/text"

import { Content } from "../../models/content"

import { translate } from "../../i18n"

const ContentSectionList: SectionListStatic<Content> = SectionListBase

@observer
export class ContentList extends React.Component<Props> {
  listItemRefs = {} as { [key: string]: React.RefObject<SwipeRow<{}>> }

  private keyExtractor = (content: Content) => `${this.props.lastFetched}${content.url}`

  private getSectionTitle = (dayTs: string) => {
    const mm = moment(parseInt(dayTs, 10))
    const today = moment().startOf("day")
    if (mm.isSameOrAfter(today)) {
      return translate("Date.Today")
    }
    if (mm.isSameOrAfter(today.subtract(1, "day"))) {
      return translate("Date.Yesterday")
    }
    return mm.format("DD-MM-YYYY")
  }

  private onEndReach = () => {
    if (
      this.props.onFetchMore &&
      this.props.hasFetched &&
      !this.props.hasFetchedAll
    ) {
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
    if (this.props.isGroupedByDay) {
      return this.renderInGroupedByDay()
    }
    return (
      <FlatList<Content>
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
        onEndReached={this.onEndReach}
        onScrollBeginDrag={this.onScrollBeginDrag}
      />
    )
  }

  private renderInGroupedByDay() {
    const now = Date.now()
    const dayGroups = this.props.data.reduce(
      (groups, content) => {
        // NOTE: `content.timestamp` could be in the future
        const dayTs = moment(Math.min(content.timestamp, now))
          .startOf('day')
          .valueOf()
          .toString()
        if (!groups[dayTs]) {
          groups[dayTs] = []
        }
        groups[dayTs].push(content)
        return groups
      },
      {} as {
        [dayTs: string]: Content[]
      }
    )

    const sections: ContentSectionListData[] = []
    Object.keys(dayGroups).forEach(dayTs => {
      sections.push({
        data: dayGroups[dayTs],
        key: dayTs,
        title: this.getSectionTitle(dayTs)
      })
    })

    return (
      <ContentSectionList
        sections={sections}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderContent}
        renderSectionHeader={this.renderSectionHeader}
        refreshControl={this.renderRefreshControl()}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        ListEmptyComponent={this.renderEmpty}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
        contentContainerStyle={this.props.data.length > 0 ? null : Style.Full}
        style={[Style.Full, this.props.style]}
        stickySectionHeadersEnabled={false}
        onEndReached={this.onEndReach}
        onScrollBeginDrag={this.onScrollBeginDrag}
      />
    )
  }

  private renderHeader = () => this.props.titleLabelTx ? (
    <Text
      tx={this.props.titleLabelTx}
      color="likeGreen"
      align="center"
      weight="600"
      style={Style.Header}
    />
  ) : null

  private renderRefreshControl = () => (
    <RefreshControl
      colors={RefreshControlColors}
      refreshing={this.props.hasFetched && this.props.isLoading}
      onRefresh={this.props.onRefresh}
    />
  )

  private renderSectionHeader = ({
    section: { title },
  }: {
    section: ContentSectionListData
  }) => {
    return (
      <ContentListSectionHeader text={title} />
    )
  }

  private renderContent: ListRenderItem<Content> = ({ item: content }) => (
    <ContentListItem
      content={content}
      isShowBookmarkIcon={this.props.isShowBookmarkIcon}
      onToggleBookmark={this.props.onToggleBookmark}
      onToggleFollow={this.props.onToggleFollow}
      onPress={this.props.onPressItem}
      onPressUndoButton={this.props.onPressUndoButton}
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
        {[...Array(7)].map((_, i) => <ContentListItemSkeleton key={`${i}`} />)}
      </View>
    )
  }

  private renderFooter = () => {
    return this.props.isFetchingMore ? (
      <View style={Style.Footer}>
        <ContentListItemSkeleton />
      </View>
    ) : null
  }
}
