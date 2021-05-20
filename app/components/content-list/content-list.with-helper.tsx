import React from "react"
import {
  ListViewProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleProp,
  View,
  ViewStyle,
} from "react-native"
import {
  ContentListItemSkeleton,
  ContentListItemStyleProps,
} from "../content-list-item"
import { Text } from "../text"

import {
  ContentListStyle as Style,
  RefreshControlColors,
} from "./content-list.style"

export interface WithContentListHelperProps extends ContentListItemStyleProps {
  emptyTx?: string

  isLoading?: boolean
  isFetchingMore?: boolean

  hasFetched?: boolean
  hasFetchedAll?: boolean

  listViewProps?: Partial<ListViewProps>

  onRefresh?: () => void
  onFetchMore?: () => void

  onEndReached?: () => void

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
    private onEndReached = () => {
      if (this.props.onEndReached) {
        this.props.onEndReached()
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

    private listViewProps: Partial<ListViewProps> = {
      onEndReachedThreshold: 0.5,
      contentContainerStyle: Style.ContentContainer,
      refreshControl: this.renderRefreshControl(),
      onScroll: this.props.onScroll,
      onEndReached: this.onEndReached,
    }

    render() {
      const { ...props } = this.props
      return (
        <WrappedComponent
          {...(props as P)}
          listViewProps={{
            ...this.listViewProps,
            style: [Style.Full, this.props.style],
            ListEmptyComponent: this.props.hasFetched ? (
              <View style={Style.Empty}>
                <Text tx={this.props.emptyTx} style={Style.EmptyLabel} />
              </View>
            ) : (
              <View>
                {[...Array(7)].map((_, i) => (
                  <ContentListItemSkeleton
                    key={`${i}`}
                    primaryColor={this.props.skeletonPrimaryColor}
                    secondaryColor={this.props.skeletonSecondaryColor}
                  />
                ))}
              </View>
            ),
            ListFooterComponent: this.props.isFetchingMore ? (
              <View style={Style.Footer}>
                <ContentListItemSkeleton
                  primaryColor={this.props.skeletonPrimaryColor}
                  secondaryColor={this.props.skeletonSecondaryColor}
                />
              </View>
            ) : null,
            ...this.props.listViewProps,
          }}
        />
      )
    }
  }
