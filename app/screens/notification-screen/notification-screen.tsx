import * as React from "react"
import {
  SectionList,
  SectionListData,
  SectionListRenderItem,
  SectionListStatic,
  View,
} from "react-native"
import { observer, inject } from "mobx-react"

import { Header } from "../../components/header"
import { I18n } from "../../components/i18n"
import {
  NotificationType,
  NotificationListItem,
} from "../../components/notification-list-item"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"

import { Notification } from "../../models/notification"

import { NotificationScreenStyle as Style } from "./notification-screen.style"
import { NotificationScreenProps as Props } from "./notification-screen.props"

const NotificationList: SectionListStatic<Notification> = SectionList

@inject("notificationStore", "userStore")
@observer
export class NotificationScreen extends React.Component<Props, {}> {
  componentDidMount() {
    this.props.notificationStore.fetch()
  }

  private getNotificationTypeFromItem = (item: Notification) => {
    switch (item.type) {
      case "transfer":
        const {
          likerID: myID,
          cosmosWallet: myAddress,
        } = this.props.userStore.currentUser
        return [myID, myAddress].includes(item.toTarget)
          ? NotificationType.Receive
          : NotificationType.Send

      case "civicliker":
        return NotificationType.CivicLikerLike

      case "superlike":
        return NotificationType.SuperLike

      case "civic-referral":
      case "app-referral":
        return NotificationType.Referral

      default:
        return undefined
    }
  }

  render() {
    return (
      <Screen preset="fixed" style={Style.Screen}>
        <Header headerTx="NotificationScreen.Title" />
        <NotificationList
          sections={this.props.notificationStore.sections}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          style={Style.List}
          contentContainerStyle={Style.ListContent}
        />
      </Screen>
    )
  }

  private renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<Notification>
  }) => {
    if (section.key === "seen") {
      const [unseen] = this.props.notificationStore.sections
      if (unseen.data.length) {
        return <View style={Style.Separator} />
      }
    }
    return null
  }

  private renderItem: SectionListRenderItem<Notification> = ({ item }) => {
    const type = this.getNotificationTypeFromItem(item)
    if (!type) return null
    return (
      <NotificationListItem
        type={type}
        ts={item.timestamp}
        style={Style.ListItem}
      >
        <I18n tx={`Notification.Message.${type}`} style={Style.Message}>
          <Text text={item.toTarget} place="to" style={Style.UserLabel} />
          <Text text={item.fromTarget} place="from" style={Style.UserLabel} />
          <Text
            text={`${item.likeAmount} LIKE`}
            place="amount"
            style={Style.AmountLabel}
          />
        </I18n>
      </NotificationListItem>
    )
  }
}
