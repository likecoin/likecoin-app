import * as React from "react"
import {
  TouchableOpacity,
  View,
} from "react-native"

import {
  ContentListItemBackProps as Props,
} from "./content-list-item.back.props"
import {
  ContentListItemBackStyle as Style,
  ICON_PROPS,
} from "./content-list-item.back.style"

import BookmarkIcon from "./button-bookmark.svg"
import UnbookmarkIcon from "./button-unbookmark.svg"
import FollowIcon from "./button-follow.svg"
import UnfollowIcon from "./button-unfollow.svg"

import { Text } from "../text"

export function ContentListItemBack(props: Props) {
  const { isShowFollowToggle = true } = props
  return (
    <View style={Style.Root}>
      {props.isBookmarked ? (
        <TouchableOpacity
          style={Style.ButtonUnbookmark}
          onPress={props.onToggleBookmark}
        >
          <UnbookmarkIcon {...ICON_PROPS} />
          <Text
            tx="ContentListItem.Back.Unbookmark"
            style={Style.ButtonTitle}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={Style.ButtonBookmark}
          onPress={props.onToggleBookmark}
        >
          <BookmarkIcon {...ICON_PROPS} />
          <Text
            tx="ContentListItem.Back.Bookmark"
            style={Style.ButtonTitle}
          />
        </TouchableOpacity>
      )}
      {isShowFollowToggle && (
        props.isFollowingCreator ? (
          <TouchableOpacity
            style={Style.ButtonUnfollow}
            onPress={props.onToggleFollow}
          >
            <UnfollowIcon {...ICON_PROPS} />
            <Text
              tx="ContentListItem.Back.Unfollow"
              style={Style.ButtonTitle}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={Style.ButtonFollow}
            onPress={props.onToggleFollow}
          >
            <FollowIcon {...ICON_PROPS} />
            <Text
              tx="ContentListItem.Back.Follow"
              style={Style.ButtonTitle}
            />
          </TouchableOpacity>
        )
      )}
    </View>
  )
}
