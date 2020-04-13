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

import { Text } from "../text"
import { Icon } from "../icon"
import { Avatar } from "../avatar"

export function StatisticsListItem(props: Props) {
  const {
    type,
    title = "",
    likeAmount = "0",
    likeCount = 0,
    numOfWorks = 0,
    numOfCivicLiker = 0,
    numOfLiker = 0,
    avatarURL = "",
    isCivicLiker = false,
  } = props
  return (
    <TouchableHighlight style={Style.Button}>
      <View style={Style.Wrapper}>
        <View style={Style.MainDetailsView}>
          <View style={Style.MainDetailsLeftView}>
            {!!avatarURL && (
              <Avatar
                src={avatarURL}
                size={40}
                isCivicLiker={isCivicLiker}
                style={Style.Avatar}
              />
            )}
            <Text
              text={title}
              style={Style.Title}
            />
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
              {type === "support" && numOfWorks > 0 && (
                <Text
                  text={`${numOfWorks} Works`}
                  style={[Style.SubDetailsText, Style.WorkCountText]}
                />
              )}
            </View>
            {type === "rewards-daily" && (
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
