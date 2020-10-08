import React from "react"
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleProp,
  View,
  ViewStyle,
} from "react-native"
import { IUseFlatListProps, IUseSectionListProps, RowMap } from "react-native-swipe-list-view"
import {
  BACK_BUTTON_BASE,
  ContentListItemSkeleton,
  ContentListItemStyleProps,
} from "../content-list-item"
import { Text } from "../text"

import {
  ContentListStyle as Style,
  RefreshControlColors,
} from "./content-list.style"


type ListViewProps = Partial<IUseSectionListProps<any>> | Partial<IUseFlatListProps<any>>

export interface WithContentListHelperProps extends ContentListItemStyleProps {
  emptyTx?: string

  isLoading?: boolean
  isFetchingMore?: boolean

  hasFetched?: boolean
  hasFetchedAll?: boolean

  listViewProps?: ListViewProps

  renderFooter?: () => React.ReactElement
  renderEmpty?: () => React.ReactElement

  toggleItemBack?: (rowMap: RowMap<any>, rowKey: string) => void

  onRefresh?: () => void
  onFetchMore?: () => void

  onEndReached?: ((info: { distanceFromEnd: number }) => void) | null

  /**
   * Fires at most once per frame during scrolling.
   * The frequency of the events can be contolled using the scrollEventThrottle prop.
   */
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void

  style?: StyleProp<ViewStyle>
}

export const withContentListHelper = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) =>
  class WithContentListHelper extends React.Component<
    P & WithContentListHelperProps
  > {
    private rowOpenSet = new Set<string>()

    private handleRowOpen = (rowKey: string) => {
      this.rowOpenSet.add(rowKey)
    }

    private handleRowClose = (rowKey: string) => {
      this.rowOpenSet.delete(rowKey)
    }

    private toggleItemBack = (rowMap: RowMap<any>, rowKey: string) => {
      if (rowMap[rowKey]) {
        if (this.rowOpenSet.has(rowKey)) {
          rowMap[rowKey].closeRow()
        } else {
          rowMap[rowKey].manuallySwipeRow(
            this.listViewProps.rightOpenValue,
          )
        }
      }
    }

    private onEndReached = (info: { distanceFromEnd: number }) => {
      if (this.props.onEndReached) {
        this.props.onEndReached(info)
      }
      if (
        this.props.onFetchMore &&
        this.props.hasFetched &&
        !this.props.hasFetchedAll
      ) {
        this.props.onFetchMore()
      }
    }

    private renderRefreshControl = () => (
      <RefreshControl
        colors={RefreshControlColors}
        refreshing={this.props.hasFetched && this.props.isLoading}
        onRefresh={this.props.onRefresh}
      />
    )

    private renderEmpty = () => {
      if (this.props.hasFetched) {
        return (
          <View style={Style.Empty}>
            <Text tx={this.props.emptyTx} style={Style.EmptyLabel} />
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

    private listViewProps: ListViewProps = {
      rightOpenValue: -BACK_BUTTON_BASE.width * 2,
      disableRightSwipe: true,
      useNativeDriver: true,
      recalculateHiddenLayout: true,
      initialNumToRender: 8,
      maxToRenderPerBatch: 10,
      onEndReachedThreshold: 0.5,
      contentContainerStyle: Style.ContentContainer,
      style: [Style.Full, this.props.style],
      refreshControl: this.renderRefreshControl(),
      ListEmptyComponent: this.renderEmpty,
      ListFooterComponent: this.renderFooter,
      onScroll: this.props.onScroll,
      onEndReached: this.onEndReached,
      onRowOpen: this.handleRowOpen,
      onRowClose: this.handleRowClose,
    }

    render() {
      const { ...props } = this.props
      return (
        <WrappedComponent
          {...(props as P)}
          listViewProps={this.listViewProps}
          toggleItemBack={this.toggleItemBack}
        />
      )
    }
  }
