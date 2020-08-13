import * as React from "react"
import { ViewProps, StyleProp } from "react-native"

export enum NotificationType {
  Send = "send",
  Receive = "receive",
  CivicLikerLike = "civic-like",
  SuperLike = "super-like",
  DailyRewards = "daily-rewards",
  Referral = "referral",
}

export interface NotificationListItemProps {
  type: NotificationType

  /**
   * The children put inside the body
   */
  children?: React.ReactNode

  /**
   * The timestamp of the notification
   */
  ts?: number

  /**
   * The view replacing the default icon
   */
  iconView?: React.ReactNode

  /**
   * Override view style.
   */
  style?: StyleProp<ViewProps>

  /**
   * A callback when the item is pressed.
   */
  onPress?: () => void
}
