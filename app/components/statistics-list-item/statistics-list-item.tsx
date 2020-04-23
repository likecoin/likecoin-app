import * as React from "react"
import {
  TouchableHighlight,
  View,
} from "react-native"

import {
  StatisticsListItemProps as Props,
} from "./statistics-list-item.props"
import {
  StatisticsListItemStyle as Style,
} from "./statistics-list-item.style"
import {
  StatisticsListItemSkeleton,
} from "./statistics-list-item.skeleton"

import { Avatar } from "../avatar"
import { Icon } from "../icon"
import { Text } from "../text"

import { color } from "../../theme"

export function StatisticsListItem(props: Props) {
  const {
    type,
    title = "",
    subtitle = "",
    likeAmount = "0",
    likeCount = 0,
    numOfWorks = 0,
    numOfCivicLiker = 0,
    numOfLiker = 0,
    avatarURL = "",
    isCivicLiker = false,
    isSkeleton = false,
  } = props
  if (isSkeleton) {
    return (
      <StatisticsListItemSkeleton type={type} />
    )
  }
  return (
    <TouchableHighlight
      style={Style.Button}
      onPress={props.onPress}
      underlayColor={color.palette.offWhite}
    >
      <View style={Style.Wrapper}>
        {!!subtitle && (
          <Text text={subtitle} style={Style.Subtitle} />
        )}
        <View style={Style.MainDetailsView}>
          <View style={Style.MainDetailsLeftView}>
            {avatarURL ? (
              <React.Fragment>
                <Avatar
                  src={avatarURL}
                  size={40}
                  isCivicLiker={isCivicLiker}
                  style={Style.Avatar}
                />
                <Text
                  text={title}
                  style={Style.TitleWithAvatar}
                />
              </React.Fragment>
            ) : (
              <Text
                text={title}
                style={Style.Title}
              />
            )}
          </View>
          <View style={Style.MainDetailsRightView}>
            <Text text={likeAmount} style={Style.LikeAmountText} />
            <Text text="LIKE" style={Style.LikeAmountUnitLabel} />
          </View>
        </View>
        <View style={Style.SubDetailsView}>
          <View style={Style.SubDetailsLeftView}>
            <View style={Style.SubDetailsItem}>
              <Icon name="like-clap" color="grey9b" style={Style.SubDetailsItemIcon} />
              <Text text={`${likeCount}`} style={Style.SubDetailsText} />
              {type === "supported-creator" && numOfWorks > 0 && (
                <Text
                  text={`${numOfWorks} Works`}
                  style={[Style.SubDetailsText, Style.WorkCountText]}
                />
              )}
            </View>
            {type === "rewarded-daily-content" && (
              <View style={Style.SubDetailsItem}>
                <Icon name="person" color="grey9b" style={Style.SubDetailsItemIcon} />
                <View>
                  <Text
                    text={`${numOfCivicLiker} Civic`}
                    style={Style.SubDetailsText}
                  />
                  <Text
                    text={`${numOfLiker} Likers`}
                    style={Style.SubDetailsText}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableHighlight>
  )
}
