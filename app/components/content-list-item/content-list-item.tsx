import * as React from "react"
import {
  Image,
  TouchableOpacity,
  View,
} from "react-native"
import ReactNativeSvg from "react-native-svg"
import { observer } from "mobx-react"

import { ContentListItemProps as Props } from "./content-list-item.props"
import { ContentListItemState as State } from "./content-list-item.state"
import { ContentListItemStyle as Style } from "./content-list-item.style"
import { ContentListItemSkeleton } from "./content-list-item.skeleton"
import BookmarkIcon from "./bookmark.svg"

import { Button } from "../button"
import { Icon } from "../icon"
import { Text } from "../text"

import { translate } from "../../i18n"
import { color } from "../../theme"

@observer
export class ContentListItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isPrevFollow: props.creator && props.creator.isFollowing,
    }
  }

  static defaultProps = {
    isShowBookmarkIcon: true,
  } as Partial<Props>

  componentDidMount() {
    if (this.props.content.shouldFetchDetails) {
      this.props.content.fetchDetails()
    }
    this.fetchCreatorDependedDetails()
  }

  componentDidUpdate() {
    this.fetchCreatorDependedDetails()
  }

  private fetchCreatorDependedDetails() {
    if (this.props.content.shouldFetchLikeStat) {
      this.props.content.fetchLikeStat()
    }
    if (this.props.content.shouldFetchCreatorDetails) {
      this.props.content.creator.fetchDetails()
    }
  }

  private onBookmark = () => {
    if (this.props.onBookmark) this.props.onBookmark(this.props.content.url)
  }

  private onPressMoreButton = () => {
    if (this.props.onPressMoreButton) {
      this.props.onPressMoreButton(this.props.content)
    }
  }

  private onPress = () => {
    if (this.props.onPress) this.props.onPress(this.props.content.url)
  }

  private onPressUndoButton = () => {
    if (this.props.onPressUndoButton) {
      this.props.onPressUndoButton(this.props.content)
    }
  }

  render() {
    const {
      content,
      style,
    } = this.props

    const {
      isLoading,
      likeCount,
      coverImageURL,
      normalizedTitle,
    } = content

    if (isLoading) {
      return <ContentListItemSkeleton />
    } else if (
      this.props.creator &&
      this.props.onPressUndoButton &&
      this.state.isPrevFollow &&
      !this.props.creator.isFollowing
    ) {
      return this.renderUndo()
    }

    const rootStyle = {
      ...Style.ROOT,
      ...style,
    }

    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={rootStyle}
      >
        <View style={Style.ROW}>
          <View style={Style.DETAIL_VIEW}>
            <Text
              color="likeGreen"
              size="default"
              weight="600"
              text={content.creatorDisplayName}
            />
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
          {content.isBookmarked &&
            this.props.isShowBookmarkIcon &&
            this.renderBookmarkFlag()
          }
        </View>
        <View style={Style.FOOTER}>
          <View>
            {likeCount > 0 &&
              <Text
                text={translate("ContentListItem.likeStatsLabel", { count: likeCount })}
                size="medium"
                prepend={(
                  <Icon
                    name="like-clap"
                    width={24}
                    color="grey9b"
                  />
                )}
                color="grey9b"
              />
            }
          </View>
          <View style={Style.BOTTOM_BUTTON_CONTAINER}>
            {this.renderBookmarkButton(content.isBookmarked)}
            {this.renderMoreButton()}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  private renderBookmarkButton(isBookmarked: boolean) {
    const iconName = isBookmarked ? "bookmark-filled" : "bookmark-outlined"
    const iconColor = isBookmarked ? "likeCyan" : "grey4a"
    return (
      <TouchableOpacity onPress={this.onBookmark}>
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
          name="three-dot-vertical"
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
              creator: this.props.creator.displayName
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
