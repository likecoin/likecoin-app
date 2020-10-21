import * as React from "react"
import { View } from "react-native"
import { observer } from "mobx-react"

import { Content } from "../../models/content"
import { Creator } from "../../models/creator"
import { SuperLike } from "../../models/super-like"

import { ContentListItemBackStyle as Style } from "./content-list-item-back.style"
import { ContentListItemBackButton as BackButton } from "./content-list-item-back-button"

export interface PureSuperLikeContentListItemBackProps {
  followee?: string
  isBookmarked?: boolean
  isFollowing?: boolean
  onToggleBookmark?: () => void
  onToggleFollow?: () => void
}

export function PureSuperLikeContentListItemBack(
  props: PureSuperLikeContentListItemBackProps,
) {
  const { followee, isBookmarked, isFollowing } = props
  return (
    <View style={Style.Root}>
      {isBookmarked ? (
        <BackButton
          preset="danger"
          tx="ContentListItem.Back.Unbookmark"
          icon="unbookmark"
          onPress={props.onToggleBookmark}
        />
      ) : (
        <BackButton
          preset="secondary"
          tx="ContentListItem.Back.Bookmark"
          icon="bookmark"
          onPress={props.onToggleBookmark}
        />
      )}
      {isFollowing ? (
        <BackButton
          preset="primary"
          tx="ContentListItem.Back.Unfollow"
          txOptions={{ followee }}
          icon="unfollow"
          onPress={props.onToggleFollow}
        />
      ) : (
        <BackButton
          preset="primary"
          tx="ContentListItem.Back.Follow"
          txOptions={{ followee }}
          icon="follow"
          onPress={props.onToggleFollow}
        />
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
      liker: {
        displayName = "",
        isFollowing: isFollowingSuperLiker = false,
      } = {},
      content: { isBookmarked = false } = {},
    } = this.props.item
    return (
      <PureSuperLikeContentListItemBack
        followee={displayName}
        isBookmarked={isBookmarked}
        isFollowing={!!isFollowingSuperLiker}
        onToggleBookmark={this.onToggleBookmark}
        onToggleFollow={this.onToggleFollow}
      />
    )
  }
}
