import * as React from "react"
import {
  Image,
  TouchableHighlight,
  View,
  ViewStyle,
} from "react-native"
import { SwipeRow } from "react-native-swipe-list-view"
import { observer } from "mobx-react"

import { ContentListItemProps as Props } from "./content-list-item.props"
import { ContentListItemState as State } from "./content-list-item.state"
import { ContentListItemStyle as Style } from "./content-list-item.style"
import { ContentListItemSkeleton } from "./content-list-item.skeleton"

import { Button } from "../button"
import { Icon } from "../icon"
import { Text } from "../text"

import { translate } from "../../i18n"
import { color } from "../../theme"
import { ContentListItemBack } from "./content-list-item.back"

@observer
export class ContentListItem extends React.Component<Props, State> {
  swipeRowRef = React.createRef<SwipeRow<{}>>()

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
    this.fetchDetails()
  }

  private getSwipeRowWidth() {
    return -(this.props.content.creator ? 128 : 64)
  }

  private async fetchDetails() {
    if (this.props.content.checkShouldFetchDetails()) {
      const promise = this.props.content.fetchDetails()
      if (!this.props.content.creator) {
        await promise
      }
    }
    if (this.props.content.creator?.checkShouldFetchDetails()) {
      this.props.content.creator.fetchDetails()
    }
  }

  private onRowOpen = () => {
    if (this.props.onSwipeOpen) this.props.onSwipeOpen(this.props.content.url, this.swipeRowRef)
    this.setState({ isRowOpen: true })
  }

  private onRowClose = () => {
    if (this.props.onSwipeClose) this.props.onSwipeClose(this.props.content.url)
    this.setState({ isRowOpen: false })
  }

  private onToggleBookmark = () => {
    this.swipeRowRef.current.closeRow()
    if (this.props.onToggleBookmark && this.props.content) {
      this.props.onToggleBookmark(this.props.content)
    }
  }

  private onToggleFollow = () => {
    this.swipeRowRef.current.closeRow()
    if (this.props.onToggleFollow) {
      this.props.onToggleFollow(this.props.content.creator)
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
    if (this.props.onPress && this.props.content) {
      this.props.onPress(this.props.content)
    }
  }

  private onPressUndoButton = () => {
    if (this.props.onPressUndoUnfollowButton) {
      this.props.onPressUndoUnfollowButton(this.props.content.creator)
    }
  }

  render() {
    if (!this.props.content || this.props.content.isLoading) {
      return (
        <ContentListItemSkeleton
          primaryColor={this.props.skeletonPrimaryColor}
          secondaryColor={this.props.skeletonSecondaryColor}
        />
      )
    }

    const {
      isBookmarked,
      isFollowingCreator,
    } = this.props.content
    if (
      this.props.onPressUndoUnfollowButton &&
      this.props.content.creator?.isShowUndoUnfollow
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
          isShowFollowToggle={!!this.props.content.creator}
          isBookmarked={isBookmarked}
          isFollowingCreator={isFollowingCreator}
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
    } = content

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
        <View style={Style.Inset}>
          <View style={Style.Layout}>
            {!!coverImageURL && (
              <Image source={{ uri: coverImageURL }} style={Style.ImageView} />
            )}
            <View style={Style.RightDetails}>
              <Text
                text={normalizedTitle}
                style={Style.Title}
              />
              <View style={Style.FooterView}>
                <Text
                  size="small"
                  color="grey9b"
                  text={content.creatorDisplayName}
                />
                <View style={Style.AccessoryView}>
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
        <Icon
          name="seen"
          fill={color.palette.grey9b}
          width={24}
          height={24}
        />
        <View style={Style.UndoTextWrapper}>
          <Text
            text={translate("common.unfollowSuccess", {
              creator: this.props.content.creator.displayName
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
