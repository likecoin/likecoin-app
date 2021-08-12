import * as React from "react"
import { View } from "react-native"
import { inject, observer } from "mobx-react"
import styled from "styled-components/native"

import { UserStore } from "../../models/user-store"
import { SupportersStore } from "../../models/supporters-store"

import { Avatar } from "../../components/avatar"
import { Icon } from "../../components/icon"
import { Text } from "../../components/text"

const TouchableOpacity = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
`

const ContentView = styled.View`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing.md};
` 

const StatsContainer = styled.View`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing.sm};
`

const SupportersCountLabel = styled(Text)`
  margin-right: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.color.text.feature.highlight.primary};
  font-size: ${({ theme }) => theme.text.size.sm};
  font-weight: 500;
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
  supportersStore?: SupportersStore
  onPress?: () => void
}

@inject(
  "userStore",
  "supportersStore",
)
@observer
export class DashboardUserInfoPanel extends React.Component<
  DashboardUserInfoPanelProps
> {
  componentDidMount() {
    if (this.props.supportersStore.status === "idle") {
      this.props.supportersStore.fetch()
    }
  }

  render() {
    const { currentUser: user } = this.props.userStore
    if (!user) return null
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Avatar
          src={user.avatarURL}
          isCivicLiker={user.isCivicLiker}
        />
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
          <StatsContainer>
            <SupportersCountLabel
              tx="supporter_count"
              txOptions={{ count: this.props.supportersStore.items.length }}
            />
          </StatsContainer>
        </ContentView>
        <View>
          <Icon
            name="arrow-right"
            width={24}
            color="likeCyan"
          />
        </View>
      </TouchableOpacity>
    )
  }
}
