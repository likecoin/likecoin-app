import * as React from "react"
import { ActivityIndicator, TouchableHighlight, View, ViewStyle } from "react-native"
import { observer } from "mobx-react"

import { translate } from "../../i18n"
import { color } from "../../theme"

import { Button } from "../button"
import { Icon } from "../icon"
import { I18n } from "../i18n"
import { Text } from "../text"

import { SuperLikeContentListItemProps as Props } from "./content-list-item.props"
import { SuperLikeContentListItemStyle as Style } from "./content-list-item.super-like.style"
import { ContentListItemStyle as LegacyStyle } from "./content-list-item.style"
import { ContentListItemSkeleton } from "./content-list-item.skeleton"

@observer
export class SuperLikeContentListItem extends React.Component<Props, {}> {
  componentDidMount() {
    if (this.props.item.content?.checkShouldFetchDetails()) {
      this.props.item.content.fetchDetails()
    }
    this.fetchCreatorDependedDetails()
  }

  componentDidUpdate() {
    this.fetchCreatorDependedDetails()
  }

  private fetchCreatorDependedDetails() {
    if (this.props.item.content?.checkShouldFetchCreatorDetails()) {
      this.props.item.content.creator.fetchDetails()
    }
    if (this.props.item.liker?.checkShouldFetchDetails()) {
      this.props.item.liker.fetchDetails()
    }
  }

  private onToggleBookmark = () => {
    if (this.props.onToggleBookmark && this.props.item?.content) {
      this.props.onToggleBookmark(this.props.item.content)
    }
  }

  private onToggleFollow = () => {
    if (this.props.onToggleFollow && this.props.item?.liker) {
      this.props.onToggleFollow(this.props.item.liker)
    }
  }

  private onPressMoreButton = () => {
    if (this.props.onPressMoreButton) {
      this.props.onPressMoreButton()
    }
  }

  private onPress = () => {
    if (this.props.onPress) {
      this.props.onPress(this.props.item)
    }
  }

  private onPressUndoButton = () => {
    if (this.props.onPressUndoUnfollowButton) {
      this.props.onPressUndoUnfollowButton(this.props.item.liker)
    }
  }

  private renderContent() {
    const { item: content } = this.props

    return (
      <TouchableHighlight
        underlayColor={this.props.underlayColor || color.palette.greyf2}
        style={LegacyStyle.Root}
        onPress={this.onPress}
      >
        <View style={Style.Inset}>
          <View style={Style.HeaderView}>
            <I18n
              tx="readerScreen.SuperLikeFromLabel"
              txOptions={{ count: content?.otherLikersCount || 0 }}
              style={Style.ShareByLabel}
            >
              <Text
                color="likeGreen"
                size="default"
                weight="600"
                text={content?.liker?.normalizedName || ""}
                place="liker"
              />
            </I18n>
            <Button
              preset="plain"
              icon="three-dot-horizontal"
              size="tiny"
              color="grey4a"
              style={Style.MoreButton}
              onPress={this.onPressMoreButton}
            />
          </View>
          <Text
            text={content?.content?.normalizedTitle || ""}
            style={Style.Title}
          />
          <View style={Style.FooterView}>
            <Text
              text={content?.content?.creatorDisplayName || ""}
              color="grey9b"
              size="default"
              weight="600"
              numberOfLines={1}
              ellipsizeMode="tail"
            />
            <View style={Style.AccessoryView}>
              {!!content?.content?.hasRead() && (
                <Icon
                  name="checkmark"
                  color="green"
                  width={16}
                  height={16}
                  style={Style.ReadIcon}
                />
              )}
              {this.props.isShowFollowToggle &&
                this.renderFollowToggle(!!content?.liker?.isFollowing)}
              {this.renderBookmarkButton(
                !!content?.content?.isBookmarked,
                !!content?.content?.isUpdatingBookmark,
              )}
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  private renderFollowToggle(isFollowing: boolean) {
    const buttonPreset = isFollowing ? "primary" : "secondary"
    const tx = `common.${isFollowing ? "Following" : "follow"}`
    return (
      <Button
        preset={buttonPreset}
        size="tiny"
        tx={tx}
        style={Style.AccessoryButton}
        onPress={this.onToggleFollow}
      />
    )
  }

  private renderBookmarkButton(isBookmarked: boolean, isUpdating: boolean) {
    const iconName = isBookmarked ? "bookmark-filled" : "bookmark-outlined"
    const buttonPreset = isBookmarked ? "primary" : "secondary"
    if (isUpdating) {
      return (
        <Button
          preset="plain"
          size="tiny"
          disabled={true}
          style={Style.AccessoryButton}
        >
          <ActivityIndicator size="small" />
        </Button>
      )
    }
    return (
      <Button
        preset={buttonPreset}
        size="tiny"
        icon={iconName}
        style={Style.AccessoryButton}
        onPress={this.onToggleBookmark}
      />
    )
  }

  private renderUndo() {
    return (
      <View style={LegacyStyle.RootUndo}>
        <Icon name="seen" width={24} height={24} fill={color.palette.grey9b} />
        <View style={LegacyStyle.UndoTextWrapper}>
          <Text
            text={translate("common.unfollowSuccess", {
              creator: this.props.item?.liker?.normalizedName || "",
            })}
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
              style={LegacyStyle.UndoButtonIcon}
            />
          }
          style={LegacyStyle.UndoButton}
          onPress={this.onPressUndoButton}
        />
      </View>
    )
  }

  renderSubView() {
    const { isLoading } = this.props.item?.content || {}
    const {
      isFetchingDetails: isFetchingSuperLikerDetails,
      hasFetchedDetails: hasFetchedSuperLikerDetails,
      isShowUndoUnfollow,
    } = this.props.item?.liker || {}
    if (isLoading || !this.props.item?.liker) {
      return (
        <ContentListItemSkeleton
          primaryColor={this.props.skeletonPrimaryColor}
          secondaryColor={this.props.skeletonSecondaryColor}
        />
      )
    } else if (
      this.props.onPressUndoUnfollowButton &&
      !isFetchingSuperLikerDetails &&
      hasFetchedSuperLikerDetails &&
      isShowUndoUnfollow
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
