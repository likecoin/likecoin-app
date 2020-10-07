import * as React from "react"
import { TouchableOpacity, View } from "react-native"
import { observer } from "mobx-react"

import { Content } from "../../models/content"
import { Creator } from "../../models/creator"
import { SuperLike } from "../../models/super-like"

import { Text } from "../text"

import {
  ContentListItemBackStyle as Style,
  ICON_PROPS,
} from "./content-list-item.back.style"

import { BookmarkIcon, FollowIcon, UnbookmarkIcon, UnfollowIcon } from "./icons"

export interface PureSuperLikeContentListItemBackProps {
  isBookmarked?: boolean
  isFollowingCreator?: boolean
  onToggleBookmark?: () => void
  onToggleFollow?: () => void
}

export function PureSuperLikeContentListItemBack(
  props: PureSuperLikeContentListItemBackProps,
) {
  return (
    <View style={Style.Root}>
      {props.isBookmarked ? (
        <TouchableOpacity
          style={Style.ButtonDanger}
          onPress={props.onToggleBookmark}
        >
          <UnbookmarkIcon
            {...ICON_PROPS}
            color={Style.ButtonPrimaryTitle.color}
          />
          <Text
            tx="ContentListItem.Back.Unbookmark"
            style={Style.ButtonPrimaryTitle}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={Style.ButtonSecondary}
          onPress={props.onToggleBookmark}
        >
          <BookmarkIcon
            {...ICON_PROPS}
            color={Style.ButtonSecondaryTitle.color}
          />
          <Text
            tx="ContentListItem.Back.Bookmark"
            style={Style.ButtonSecondaryTitle}
          />
        </TouchableOpacity>
      )}
      {props.isFollowingCreator ? (
        <TouchableOpacity
          style={Style.ButtonNeutral}
          onPress={props.onToggleFollow}
        >
          <UnfollowIcon
            {...ICON_PROPS}
            color={Style.ButtonPrimaryTitle.color}
          />
          <Text
            tx="ContentListItem.Back.Unfollow"
            style={Style.ButtonPrimaryTitle}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={Style.ButtonPrimary}
          onPress={props.onToggleFollow}
        >
          <FollowIcon
            {...ICON_PROPS}
            color={Style.ButtonPrimaryTitle.color}
          />
          <Text tx="ContentListItem.Back.Follow" style={Style.ButtonPrimary} />
        </TouchableOpacity>
      )}
    </View>
  )
}

export interface SuperLikeContentListItemBackProps {
  item: SuperLike
  onTriggerAction?: () => void
  onToggleBookmark?: (content: Content) => void
  onToggleFollow?: (creator: Creator) => void
}

@observer
export class SuperLikeContentListItemBack extends React.Component<
  SuperLikeContentListItemBackProps,
  {}
> {
  private triggerAction = () => {
    if (this.props.onTriggerAction) {
      this.props.onTriggerAction()
    }
  }

  private onToggleBookmark = () => {
    if (this.props.onToggleBookmark && this.props.item?.content) {
      this.props.onToggleBookmark(this.props.item.content)
    }
    this.triggerAction()
  }

  private onToggleFollow = () => {
    if (this.props.onToggleFollow && this.props.item?.liker) {
      this.props.onToggleFollow(this.props.item.liker)
    }
    this.triggerAction()
  }

  render() {
    const {
      liker: { isFollowing: isFollowingSuperLiker },
      content: { isBookmarked },
    } = this.props.item
    return (
      <PureSuperLikeContentListItemBack
        isBookmarked={isBookmarked}
        isFollowingCreator={!!isFollowingSuperLiker}
        onToggleBookmark={this.onToggleBookmark}
        onToggleFollow={this.onToggleFollow}
      />
    )
  }
}
