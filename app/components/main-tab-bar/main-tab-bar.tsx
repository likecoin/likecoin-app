import * as React from "react"
import { inject, observer } from "mobx-react"

import { MainTabBarIconProps } from "./main-tab-bar.props"

import { Icon, IconTypes } from "../icon"

import { RootStore } from "../../models/root-store"
import { color } from "../../theme"
import { Avatar } from "../avatar"

@inject((rootStore: RootStore) => ({
  user: rootStore.userStore.currentUser,
}))
@observer
export class MainTabBarIcon extends React.Component<MainTabBarIconProps> {
  render() {
    const { focused, routeName, user } = this.props
    let name: IconTypes
    let size = 24
    switch (routeName) {
      case "Bookmark":
        name = "tab-bookmark"
        break
      case "Reader":
        name = "tab-reader"
        size = 32
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
      case "Wallet":
        name = "tab-wallet"
        break
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
