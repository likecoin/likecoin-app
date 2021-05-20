import * as React from "react"
import { observer } from "mobx-react"
import styled from "styled-components/native"

import { Content } from "../../models/content"
import { Creator } from "../../models/creator"
import { SuperLike } from "../../models/super-like"

import { Button as UnstyledButton } from "../button"
import { Text } from "../text"

const RootView = styled.View`
  padding: ${({ theme }) => theme.spacing.lg};
`

const Button = styled(UnstyledButton)`
  /* justify-content: flex-start; */
  padding: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.color.background.primary};
`

const ButtonTitle = styled(Text)`
  font-size: ${({ theme }) => theme.text.size.md};
  text-align: left;
`

export interface PureSuperLikeContentListItemActionSheetProps {
  followee?: string
  isBookmarked?: boolean
  isFollowing?: boolean
  onToggleBookmark?: () => void
  onToggleFollow?: () => void
}

export function PureSuperLikeContentListItemActionSheet(
  props: PureSuperLikeContentListItemActionSheetProps,
) {
  const { followee, isBookmarked, isFollowing } = props
  const bookmarkButtonTitleTx = isBookmarked
    ? "content_list_item_action_sheet_unbookmark"
    : "content_list_item_action_sheet_bookmark" 
  const followingButtonTitleTx = isFollowing
    ? "content_list_item_action_sheet_unfollow"
    : "content_list_item_action_sheet_follow" 
  return (
    <RootView>
      <Button onPress={props.onToggleBookmark}>
        <ButtonTitle tx={bookmarkButtonTitleTx} />
      </Button>
      <Button onPress={props.onToggleFollow}>
        <ButtonTitle tx={followingButtonTitleTx} txOptions={{ followee }} />
      </Button>
    </RootView>
  )
}

export interface SuperLikeContentListItemActionSheetProps {
  item: SuperLike
  onTriggerAction?: () => void
  onToggleBookmark?: (content: Content) => void
  onToggleFollow?: (creator: Creator) => void
}

@observer
export class SuperLikeContentListItemActionSheet extends React.Component<
  SuperLikeContentListItemActionSheetProps,
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
      <PureSuperLikeContentListItemActionSheet
        followee={displayName}
        isBookmarked={isBookmarked}
        isFollowing={!!isFollowingSuperLiker}
        onToggleBookmark={this.onToggleBookmark}
        onToggleFollow={this.onToggleFollow}
      />
    )
  }
}
