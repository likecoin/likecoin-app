import * as React from "react"

import { MainTabBarIconProps } from "./main-tab-bar.props"

import { Icon, IconTypes } from "../icon"

import { color } from "../../theme"

export class MainTabBarIcon extends React.Component<MainTabBarIconProps> {
  render() {
    let name: IconTypes
    let size = 24
    switch (this.props.routeName) {
      case "Bookmark":
        name = "tab-bookmark"
        break
      case "Reader":
        name = "tab-reader"
        size = 32
        break
      case "Settings":
        name = "tab-settings"
        break
      case "Wallet":
        name = "tab-wallet"
        break
    }
    const fill = this.props.focused ? color.palette.likeCyan : color.palette.lightGrey
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
