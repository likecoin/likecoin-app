import * as React from "react"
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import { observer } from "mobx-react"

import { FollowSettingsListItemProps as Props } from "./follow-settings-list-item.props"
import { FollowSettingsListItemStyle as Style } from "./follow-settings-list-item.style"

import { Avatar } from "../../components/avatar"
import { Button } from "../../components/button"
import { Icon } from "../../components/icon"
import { Text } from "../../components/text"

@observer
export class FollowingSettingsListItem extends React.Component<Props> {
  state = {
    isShowUnfollowButton: false,
  }

  componentDidMount() {
    if (!this.props.creator.hasFetchedDetails) {
      this.props.creator.fetchDetails()
    }
  }

  private onPress = () => {
    this.setState({ isShowUnfollowButton: false })
  }

  private onPressMoreButton = () => {
    this.setState({ isShowUnfollowButton: true })
  }

  private onPressFollow = () => {
    if (this.props.onPressFollow) {
      this.props.onPressFollow(this.props.creator)
    }
  }

  private onPressUnfollow = () => {
    if (this.props.onPressUnfollow) {
      this.props.onPressUnfollow(this.props.creator)
    }
    this.setState({ isShowUnfollowButton: false })
  }

  render() {
    const { creator } = this.props
    return (
      <TouchableWithoutFeedback
        key={creator.likerID}
        onPress={this.onPress}
      >
        <View style={[Style.Root, this.state.isShowUnfollowButton ? Style.RootToggled : {}]}>
          <View style={Style.Left}>
            <Avatar
              src={creator.avatarURL}
              isCivicLiker={creator.isCivicLiker}
              size={28}
              style={Style.Avatar}
            />
            <Text
              text={creator.displayName || creator.likerID}
              numberOfLines={1}
              ellipsizeMode="middle"
            />
          </View>
          {this.renderRight()}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  private renderRight() {
    if (this.props.type === "follow") {
      if (this.state.isShowUnfollowButton) {
        return (
          <Button
            color="white"
            tx="common.unfollow"
            size="default"
            style={[Style.Right, Style.UnfollowButton]}
            onPress={this.onPressUnfollow}
          />
        )
      }

      return (
        <View style={Style.Right}>
          <TouchableOpacity
            onPress={this.onPressMoreButton}
          >
            <Icon
              name="three-dot-horizontal"
              width="24"
              height="24"
              color="grey4a"
            />
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <Button
        preset="plain"
        tx="common.follow"
        size="default"
        style={Style.Right}
        onPress={this.onPressFollow}
      />
    )
  }
}
