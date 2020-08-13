import * as React from "react"
import { storiesOf } from "@storybook/react-native"

import {
  NotificationListItem,
} from "./notification-list-item"
import {
  NotificationType,
} from "./notification-list-item.props"

import { Avatar } from "../avatar"
import { I18n } from "../i18n"
import { Text } from "../text"

import {
  Story,
  StoryScreen,
  UseCase,
} from "../../../storybook/views"
import { Alert } from "react-native"

declare let module: any

const DATE_STRING = "12/06/19 15:47"

const AmountText = (value: number) => {
  return (
    <Text
      text={`${value} LIKE`}
      color="green"
      weight="600"
      place="amount"
    />
  )
}

const PersonText = (name: string, place: string) => {
  return (
    <Text
      text={name}
      color="likeGreen"
      weight="600"
      place={place}
      onPress={() => Alert.alert(name)}
    />
  )
}

storiesOf("NotificationListItem", module)
  .addDecorator((fn: () => React.ReactNode) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behavior", () => {
    return (
      <Story>
        <UseCase
          text="Send"
          noBackground={true}
        >
          <NotificationListItem
            type={NotificationType.Send}
            dateString={DATE_STRING}
            iconView={(
              <Avatar
                size={28}
                src="https://via.placeholder.com/100"
              />
            )}
          >
            <I18n tx={`Notification.Message.${NotificationType.Send}`}>
              {PersonText("Alice", "to")}
              {AmountText(99.9999)}
            </I18n>
          </NotificationListItem>
        </UseCase>
        <UseCase
          text="Receive"
          noBackground={true}
        >
          <NotificationListItem
            type={NotificationType.Receive}
            dateString={DATE_STRING}
            iconView={(
              <Avatar
                size={28}
                src="https://via.placeholder.com/100"
              />
            )}
          >
            <I18n tx={`Notification.Message.${NotificationType.Receive}`}>
              {PersonText("Bob", "from")}
              {AmountText(99.9999)}
            </I18n>
          </NotificationListItem>
        </UseCase>
        <UseCase
          text="Civic Liker"
          noBackground={true}
        >
          <NotificationListItem
            type={NotificationType.CivicLikerLike}
            dateString={DATE_STRING}
          >
            <I18n tx={`Notification.Message.${NotificationType.CivicLikerLike}`}>
              {PersonText("Alice", "liker")}
              {AmountText(1)}
            </I18n>
          </NotificationListItem>
        </UseCase>
        <UseCase
          text="Daily Rewards"
          noBackground={true}
        >
          <NotificationListItem
            type={NotificationType.DailyRewards}
            dateString={DATE_STRING}
          >
            <I18n tx={`Notification.Message.${NotificationType.DailyRewards}`}>
              {PersonText("3 Likers", "likers")}
              {AmountText(65.4321)}
            </I18n>
          </NotificationListItem>
        </UseCase>
        <UseCase
          text="Referral"
          noBackground={true}
        >
          <NotificationListItem
            type={NotificationType.Referral}
            dateString={DATE_STRING}
          >
            <I18n tx={`Notification.Message.${NotificationType.Referral}`}>
              {PersonText("Carol", "from")}
              {AmountText(100)}
            </I18n>
          </NotificationListItem>
        </UseCase>
      </Story>
    )
  })
