import * as React from "react"
import { Image, TouchableHighlight, View, ViewStyle } from "react-native"
import { observer } from "mobx-react"

import { color } from "../../theme"

import { Button } from "../button"
import { Text } from "../text"

import { BookmarkedContentListItemProps as Props } from "./content-list-item.props"
import { ContentListItemStyle as StyleCommon } from "./content-list-item.style"
import { BookmarkedContentListItemStyle as Style } from "./content-list-item.bookmark.style"
import { ContentListItemSkeleton } from "./content-list-item.skeleton"
import { withContentListItemHelper } from "./content-list-item.with-helper"
import { ContentListItemUndoView } from "./content-list-item-undo-view"

@observer
class BookmarkedContentListItemBase extends React.Component<Props, {}> {
  componentDidMount() {
    this.props.fetchContentDetails(this.props.item)
  }

  private onPressArchiveButton = () => {
    if (this.props.onPressArchiveButton) {
      this.props.onPressArchiveButton(this.props.item)
    }
  }

  private onPress = () => {
    if (this.props.onPress && this.props.item) {
      this.props.onPress(this.props.item)
    }
  }

  private onPressUndoButton = () => {
    if (this.props.onPressUndoRemoveBookmarkButton) {
      this.props.onPressUndoRemoveBookmarkButton(this.props.item)
    }
  }

  private renderContent() {
    const { item: content } = this.props

    const {
      coverImageURL,
      normalizedTitle,
      isArchived,
      isUpdatingBookmarkArchive,
    } = content

    return (
      <TouchableHighlight
        underlayColor={this.props.underlayColor || color.palette.greyf2}
        onPress={this.onPress}
      >
        <View style={StyleCommon.Inset}>
          <View style={Style.Layout}>
            {!!coverImageURL && (
              <Image source={{ uri: coverImageURL }} style={StyleCommon.ImageView} />
            )}
            <View style={StyleCommon.RightDetails}>
              <Text text={normalizedTitle} style={StyleCommon.Title} />
              <View style={StyleCommon.FooterView}>
                <Text
                  text={content.creatorDisplayName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={StyleCommon.CreatorDisplayName}
                />
                <View style={StyleCommon.AccessoryView}>
                  {!isArchived && (
                    <Button
                      key={`archive-${isArchived}`}
                      preset="secondary"
                      size="tiny"
                      icon="archive"
                      isLoading={isUpdatingBookmarkArchive}
                      disabled={isArchived}
                      style={StyleCommon.MoreButton}
                      onPress={this.onPressArchiveButton}
                    />
                  )}
                  {this.props.renderMoreButton()}
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  private renderUndo() {
    return (
      <ContentListItemUndoView
        tx="ContentListItem.BookmarkRemoveLabel"
        onPress={this.onPressUndoButton}
      />
    )
  }

  private renderSubView() {
    if (!this.props.item || this.props.item.isLoading) {
      return (
        <ContentListItemSkeleton
          primaryColor={this.props.skeletonPrimaryColor}
          secondaryColor={this.props.skeletonSecondaryColor}
        />
      )
    }

    if (
      this.props.onPressUndoRemoveBookmarkButton &&
      this.props.item.bookmark?.willBeDeleted
    ) {
      return this.renderUndo()
    }

    return this.renderContent()
  }

  render() {
    const style: ViewStyle = {
      backgroundColor: this.props.backgroundColor || color.palette.white,
      ...this.props.style,
    }
    return <View style={style}>{this.renderSubView()}</View>
  }
}

export const BookmarkedContentListItem = withContentListItemHelper(
  BookmarkedContentListItemBase,
)
