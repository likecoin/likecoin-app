import * as React from "react"
import { View } from "react-native"
import { inject, observer } from "mobx-react"

import { UserStore } from "../../models/user-store"

import { Avatar } from "../../components/avatar"
import { Text } from "../../components/text"

import { SettingsScreenUserInfoPanelStyle as Style } from "./settings-screen-user-info-panel.style"

export interface SettingsScreenUserInfoPanelProps {
  userStore?: UserStore
  onPress?: () => void
  onPressQRCodeButton?: () => void
}

@inject("userStore")
@observer
export class SettingsScreenUserInfoPanel extends React.Component<
  SettingsScreenUserInfoPanelProps
> {
  render() {
    const { currentUser: user } = this.props.userStore
    if (!user) return null
    return (
      <View style={Style.Root}>
        <Avatar
          src={user.avatarURL}
          isCivicLiker={user.isCivicLiker}
        />
        <View style={Style.Identity}>
          <Text
            style={Style.UserID}
            text={`Liker ID: ${user.likerID}`}
          />
          <Text
            style={Style.DisplayName}
            text={user.displayName}
            numberOfLines={2}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
          />
        </View>
      </View>
    )
  }
}
