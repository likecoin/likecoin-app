import * as React from "react"
import { View } from "react-native"
import styled from "styled-components/native"
import { inject, observer } from "mobx-react"

import { MainTabBarIconProps } from "./main-tab-bar.props"

import { Avatar } from "../avatar"
import { Icon, IconTypes } from "../icon"

import { RootStore } from "../../models/root-store"

import { color } from "../../theme"

const NotificationIconWrapper = styled(View)`
  position: relative;
`
const NotificationDot = styled(View)`
  position: absolute;
  top: 0;
  right: 0;
  width: 8;
  height: 8;
  borderRadius: 4;
  background-color: #e35050;
`

@inject((rootStore: RootStore) => ({
  user: rootStore.userStore.currentUser,
  unseenEventCount: rootStore.userStore.unseenEventCount,
}))
@observer
export class MainTabBarIcon extends React.Component<MainTabBarIconProps> {
  render() {
    const { focused, routeName, user, unseenEventCount } = this.props
    let name: IconTypes
    const size = 24
    switch (routeName) {
      case "Dashboard":
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
        name = "tab-wallet"
        break;
      case "Bookmark":
        name = "bookmarks"
        break
      case "NFT":
        name = "nft-stack"
        break
      case "Reader":
        name = "super-like"
        break
      case "Notification":
        name = "bell"
        break
      case "Settings": {
        name = "tab-settings"
        break
      }
    }
    const fill = focused ? color.palette.likeCyan : color.palette.lightGrey
    const icon = (
      <Icon
        name={name}
        width={size}
        height={size}
        fill={fill}
      />
    )

    if (routeName === "Notification" && unseenEventCount > 0) {
      return (
        <NotificationIconWrapper>
          <NotificationDot />
          {icon}
        </NotificationIconWrapper>
      )
    }

    return icon
  }
}
