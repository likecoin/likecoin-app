import * as React from "react"
import { Image, TouchableHighlight, View, ViewStyle } from "react-native"
import { observer } from "mobx-react"

import { color } from "../../theme"

import { Button } from "../button"
import { Icon } from "../icon"
import { Text } from "../text"

import { BookmarkedContentListItemProps as Props } from "./content-list-item.props"
import { ContentListItemStyle as Style } from "./content-list-item.style"
import { ContentListItemSkeleton } from "./content-list-item.skeleton"

@observer
export class BookmarkedContentListItem extends React.Component<Props, {}> {
  componentDidMount() {
    this.fetchDetails()
  }

  private async fetchDetails() {
    if (this.props.item.checkShouldFetchDetails()) {
      const promise = this.props.item.fetchDetails()
      if (!this.props.item.creator) {
        await promise
      }
    }
    if (this.props.item.creator?.checkShouldFetchDetails()) {
      this.props.item.creator.fetchDetails()
    }
  }

  private onPressArchiveButton = () => {
    this.props.item.archiveBookmark()
  }

  private onPressMoreButton = () => {
    if (this.props.onPressMoreButton) {
      this.props.onPressMoreButton()
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
        style={Style.Root}
        onPress={this.onPress}
      >
        <View style={Style.Inset}>
          <View style={Style.Layout}>
            {!!coverImageURL && (
              <Image source={{ uri: coverImageURL }} style={Style.ImageView} />
            )}
            <View style={Style.RightDetails}>
              <Text text={normalizedTitle} style={Style.Title} />
              <View style={Style.FooterView}>
                <Text
                  size="default"
                  weight="600"
                  color="grey9b"
                  text={content.creatorDisplayName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={Style.CreatorDisplayName}
                />
                <View style={Style.AccessoryView}>
                  {!isArchived && (
                    <Button
                      key={`archive-${isArchived}`}
                      preset="secondary"
                      size="tiny"
                      icon="archive"
                      isLoading={isUpdatingBookmarkArchive}
                      disabled={isArchived}
                      style={Style.MoreButton}
                      onPress={this.onPressArchiveButton}
                    />
                  )}
                  <Button
                    preset="plain"
                    icon="three-dot-horizontal"
                    size="tiny"
                    color="grey4a"
                    style={Style.MoreButton}
                    onPress={this.onPressMoreButton}
                  />
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
      <View style={Style.RootUndo}>
        <View style={Style.UndoTextWrapper}>
          <Text
            tx="ContentListItem.BookmarkRemoveLabel"
            weight="600"
            color="grey9b"
            numberOfLines={1}
            ellipsizeMode="middle"
          />
        </View>
        <Button
          preset="plain"
          tx="common.undo"
          fontSize="default"
          append={
            <Icon
              name="undo"
              width={16}
              height={16}
              fill={color.primary}
              style={Style.UndoButtonIcon}
            />
          }
          style={Style.UndoButton}
          onPress={this.onPressUndoButton}
        />
      </View>
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
    return (
      <View style={style}>
        {this.renderSubView()}
      </View>
    )
  }
}
