import * as React from "react"
import { inject, observer } from "mobx-react"

import { MainTabBarIconProps } from "./main-tab-bar.props"

import { Avatar } from "../avatar"
import { Icon, IconTypes } from "../icon"

import { RootStore } from "../../models/root-store"

import { color } from "../../theme"

@inject((rootStore: RootStore) => ({
  user: rootStore.userStore.currentUser,
}))
@observer
export class MainTabBarIcon extends React.Component<MainTabBarIconProps> {
  render() {
    const { focused, routeName, user } = this.props
    let name: IconTypes
    const size = 24
    switch (routeName) {
      case "Bookmark":
        name = "bookmarks"
        break
      case "Reader":
        name = "super-like"
        break
      case "Notification":
        name = "bell"
        break
      case "Settings": {
        if (user) {
          const { avatarURL: src, isCivicLiker } = user
          return (
            <Avatar
              src={src}
              size={28}
              focused={focused}
              isCivicLiker={isCivicLiker}
            />
          )
        }
        name = "tab-settings"
        break
      }
    }
    const fill = focused ? color.palette.likeCyan : color.palette.lightGrey
    return (
      <Icon
        name={name}
        width={size}
        height={size}
        fill={fill}
      />
    )
  }
}
