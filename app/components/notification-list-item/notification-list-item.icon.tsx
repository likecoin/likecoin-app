import * as React from "react"
import { StyleSheet, View, ViewStyle } from "react-native"

import { color, spacing } from "../../theme"

import { Icon, IconTypes } from "../icon"

import {
  NotificationType,
} from "./notification-list-item.props"

const Style = StyleSheet.create({
  Wrapper: {
    padding: spacing[1],
    borderRadius: 16,
  } as ViewStyle,
})

export function getIcon(type: NotificationType) {
  let iconName: IconTypes
  switch (type) {
    case NotificationType.Referral:
    case NotificationType.Send:
    case NotificationType.Receive:
      iconName = "like-clap"
      break
    default:
      iconName = "bell"
  }

  return (
    <View style={Style.Wrapper}>
      <Icon
        name={iconName}
        width={24}
        height={24}
        fill={color.primary}
      />
    </View>
  )
}
