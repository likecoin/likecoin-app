import * as React from "react"
import { View } from "react-native"
import { observer } from "mobx-react"

import { Avatar } from "../../components/avatar"
import { Button } from "../../components/button"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"

import { ReferrerFollowScreenProps as Props } from "./referrer-follow-screen.props"
import { ReferrerFollowScreenStyle as Style } from "./referrer-follow-screen.style"

@observer
export class ReferrerFollowScreen extends React.Component<Props, {}> {
  get referrer() {
    return this.props.navigation.getParam("referrer")
  }

  private onClose = () => {
    this.props.navigation.pop()
  }

  private onPressUnfollowButton = () => {
    this.referrer.unfollow()
    this.props.navigation.pop()
  }

  render() {
    return (
      <Screen preset="fixed" style={Style.Screen}>
        <View style={Style.ReferrerView}>
          <Text tx="ReferrerFollowScreen.Heading" style={Style.Heading} />
          <Avatar
            src={this.referrer.avatarURL}
            isCivicLiker={this.referrer.isCivicLiker}
            size={128}
            style={Style.Avatar}
          />
          <Text text={this.referrer.normalizedName} style={Style.DisplayName} />
        </View>
        <View style={Style.ActionButtonContainer}>
          <Button tx="common.ok" preset="primary" onPress={this.onClose} />
          <Button
            tx="common.unfollow"
            preset="link"
            color="likeCyan"
            style={Style.UnfollowButton}
            onPress={this.onPressUnfollowButton}
          />
        </View>
      </Screen>
    )
  }
}
