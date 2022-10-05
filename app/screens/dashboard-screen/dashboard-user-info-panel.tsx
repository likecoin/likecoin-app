import * as React from "react"
import { TouchableOpacity } from "react-native"
import { inject, observer } from "mobx-react"
import styled from "styled-components/native"

import { UserStore } from "../../models/user-store"

import { Avatar } from "../../components/avatar"
import { Text } from "../../components/text"

const RootView = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
`

const ContentView = styled.View`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing.md};
`

const LikerIDLabel = styled(Text)`
  color: ${({ theme }) => theme.color.text.feature.primary};
  font-size: ${({ theme }) => theme.text.size.sm};
  opacity: 0.6;
`

const DisplayNameLabel = styled(Text)`
  color: ${({ theme }) => theme.color.text.feature.primary};
  font-size: ${({ theme }) => theme.text.size.xl};
  font-weight: 500;
`

export interface DashboardUserInfoPanelProps {
  userStore?: UserStore
  onAvatarUpload?: () => {} 
}

@inject("userStore")
@observer
export class DashboardUserInfoPanel extends React.Component<
  DashboardUserInfoPanelProps
> {
  render() {
    const { currentUser: user } = this.props.userStore
    if (!user) return null
    return (
      <RootView>
        <TouchableOpacity onPress={this.props.onAvatarUpload}>
          <Avatar
            src={user.avatarURL}
            isCivicLiker={user.isCivicLiker}
          />
        </TouchableOpacity>
        <ContentView>
          <LikerIDLabel
            text={`Liker ID: ${user.likerID}`}
          />
          <DisplayNameLabel
            text={user.displayName}
            numberOfLines={2}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
          />
        </ContentView>
      </RootView>
    )
  }
}
