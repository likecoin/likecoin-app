import * as React from "react"
import {
  Image,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { SwipeRow } from "react-native-swipe-list-view"
import ReactNativeSvg from "react-native-svg"
import { observer } from "mobx-react"

import {
  SuperLikedContentListItemProps as Props,
} from "./content-list-item.props"
import { ContentListItemState as State } from "./content-list-item.state"
import { ContentListItemStyle as Style } from "./content-list-item.style"
import { ContentListItemSkeleton } from "./content-list-item.skeleton"
import BookmarkIcon from "./bookmark.svg"

import { Button } from "../button"
import { Icon } from "../icon"
import { I18n } from "../i18n"
import { Text } from "../text"

import { translate } from "../../i18n"
import { color } from "../../theme"
import { ContentListItemBack } from "./content-list-item.back"

@observer
export class SuperLikedContentListItem extends React.Component<Props, State> {
  swipeRowRef = React.createRef<SwipeRow<{}>>()

  isPrevFollow = this.props.content.liker.isFollowing

  constructor(props: Props) {
    super(props)

    this.state = {
      isRowOpen: false,
      offsetX: 0,
    }
  }

  static defaultProps = {
    isShowBookmarkIcon: true,
  } as Partial<Props>

  componentDidMount() {
    if (this.props.content.content.shouldFetchDetails) {
      this.props.content.content.fetchDetails()
    }
    this.fetchCreatorDependedDetails()
  }

  componentDidUpdate() {
    this.fetchCreatorDependedDetails()
  }

  private getSwipeRowWidth() {
    return -(this.props.content.liker ? 128 : 64)
  }

  private fetchCreatorDependedDetails() {
    if (this.props.content.content.shouldFetchLikeStat) {
      this.props.content.content.fetchLikeStat()
    }
    if (this.props.content.content.shouldFetchCreatorDetails) {
      this.props.content.content.creator.fetchDetails()
    }
    if (!this.props.content.liker.hasFetchedDetails) {
      this.props.content.liker.fetchDetails()
    }
  }

  private onRowOpen = () => {
    if (this.props.onSwipeOpen) {
      this.props.onSwipeOpen(this.props.content.content.url, this.swipeRowRef)
    }
    this.setState({ isRowOpen: true })
  }

  private onRowClose = () => {
    if (this.props.onSwipeClose) {
      this.props.onSwipeClose(this.props.content.content.url)
    }
    this.setState({ isRowOpen: false })
  }

  private onToggleBookmark = () => {
    this.swipeRowRef.current.closeRow()
    if (this.props.onToggleBookmark) {
      this.props.onToggleBookmark(this.props.content.content.url)
    }
  }

  private onToggleFollow = () => {
    this.swipeRowRef.current.closeRow()
    if (this.props.onToggleFollow) {
      this.props.onToggleFollow(this.props.content.liker)
    }
  }

  private onPressMoreButton = () => {
    if (this.state.isRowOpen) {
      this.swipeRowRef.current.closeRow()
    } else {
      this.swipeRowRef.current.manuallySwipeRow(this.getSwipeRowWidth())
    }
  }

  private onPress = () => {
    if (this.props.onPress) {
      this.props.onPress(this.props.content)
    }
  }

  private onPressUndoButton = () => {
    if (this.props.onPressUndoUnfollowButton) {
      this.props.onPressUndoUnfollowButton(this.props.content.liker)
    }
  }

  render() {
    const {
      isBookmarked,
      isLoading,
    } = this.props.content.content

    if (isLoading) {
      return (
        <ContentListItemSkeleton
          primaryColor={this.props.skeletonPrimaryColor}
          secondaryColor={this.props.skeletonSecondaryColor}
        />
      )
    } else if (
      this.props.content.liker &&
      this.props.onPressUndoUnfollowButton &&
      this.isPrevFollow &&
      !this.props.content.liker.isFollowing
    ) {
      return this.renderUndo()
    }

    return (
      <SwipeRow
        ref={this.swipeRowRef}
        rightOpenValue={this.getSwipeRowWidth()}
        stopLeftSwipe={0}
        onRowOpen={this.onRowOpen}
        onRowClose={this.onRowClose}
      >
        <ContentListItemBack
          isShowFollowToggle={!!this.props.content.liker}
          isBookmarked={isBookmarked}
          isFollowingCreator={this.props.content.liker.isFollowing}
          onToggleBookmark={this.onToggleBookmark}
          onToggleFollow={this.onToggleFollow}
        />
        {this.renderFront()}
      </SwipeRow>
    )
  }

  private renderFront() {
    const {
      backgroundColor,
      content,
      style,
    } = this.props

    const {
      coverImageURL,
      normalizedTitle,
    } = content.content

    const rootStyle = {
      ...Style.Root,
      ...style,
      transform: [{ translateX: this.state.offsetX }],
    } as ViewStyle

    if (backgroundColor) {
      rootStyle.backgroundColor = backgroundColor
    }

    return (
      <TouchableHighlight
        underlayColor={this.props.underlayColor || color.palette.greyf2}
        style={rootStyle}
        onPress={this.onPress}
      >
        <View>
          <View style={Style.ROW}>
            <View style={Style.DETAIL_VIEW}>
              <I18n
                tx="readerScreen.SuperLikeFromLabel"
                style={Style.SharedLabel}
              >
                <Text
                  color="likeGreen"
                  size="default"
                  weight="600"
                  text={content.liker.displayName}
                  place="liker"
                />
              </I18n>
              <Text
                color="grey4a"
                size="medium"
                weight="600"
                text={normalizedTitle}
                style={Style.DETAIL_TEXT}
              />
            </View>
            {!!coverImageURL &&
              <Image
                source={{ uri: coverImageURL }}
                style={Style.IMAGE_VIEW}
              />
            }
            {content.content.isBookmarked &&
              this.props.isShowBookmarkIcon &&
              this.renderBookmarkFlag()
            }
          </View>
          <View style={Style.FOOTER}>
            <View>
              <Text
                text={content.content.creatorDisplayName}
                size="small"
                color="grey9b"
              />
            </View>
            <View style={Style.BOTTOM_BUTTON_CONTAINER}>
              {this.renderBookmarkButton(content.content.isBookmarked)}
              {this.renderMoreButton()}
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  private renderBookmarkButton(isBookmarked: boolean) {
    const iconName = isBookmarked ? "bookmark-filled" : "bookmark-outlined"
    const iconColor = isBookmarked ? "likeCyan" : "grey4a"
    return (
      <TouchableOpacity onPress={this.onToggleBookmark}>
        <Icon
          name={iconName}
          width={24}
          height={24}
          color={iconColor}
        />
      </TouchableOpacity>
    )
  }

  private renderMoreButton() {
    return (
      <TouchableOpacity
        style={Style.MORE_BUTTON}
        onPress={this.onPressMoreButton}
      >
        <Icon
          name="three-dot-horizontal"
          width={24}
          height={24}
          color="grey4a"
        />
      </TouchableOpacity>
    )
  }

  private renderBookmarkFlag() {
    if (typeof BookmarkIcon !== "function") {
      return <ReactNativeSvg style={Style.BOOKMARK_FLAG} />
    }
    return (
      <BookmarkIcon
        width={24}
        height={24}
        style={Style.BOOKMARK_FLAG}
      />
    )
  }

  private renderUndo() {
    return (
      <View style={Style.RootUndo}>
        <Icon
          name="seen"
          fill={color.palette.grey9b}
          width={24}
          height={24}
        />
        <View style={Style.UndoTextWrapper}>
          <Text
            text={translate("common.unfollowSuccess", {
              creator: this.props.content.liker.displayName
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
          size="default"
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
}
