import * as React from "react"
import {
  Linking,
  SectionList,
  SectionListData,
  SectionListRenderItem,
  SectionListStatic,
  View,
  RefreshControl,
} from "react-native"
import { NavigationEventSubscription } from "react-navigation"
import { observer, inject } from "mobx-react"

import { Notification } from "../../models/notification"

import { Header } from "../../components/header"
import { I18n } from "../../components/i18n"
import {
  NotificationType,
  NotificationListItem,
} from "../../components/notification-list-item"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"

import { color } from "../../theme"

import { NotificationScreenStyle as Style } from "./notification-screen.style"
import { NotificationScreenProps as Props } from "./notification-screen.props"

const NotificationList: SectionListStatic<Notification> = SectionList

@inject("notificationStore", "userStore")
@observer
export class NotificationScreen extends React.Component<Props, {}> {
  willFocusListener?: NavigationEventSubscription

  willBlurListener?: NavigationEventSubscription

  componentDidMount() {
    this.willBlurListener = this.props.navigation.addListener(
      "willFocus",
      this.props.notificationStore.fetch,
    )
    this.willBlurListener = this.props.navigation.addListener(
      "willBlur",
      this.props.notificationStore.readAll,
    )

    this.props.notificationStore.fetch()
  }

  componentWillUnmount() {
    if (this.willFocusListener) this.willFocusListener.remove()
    if (this.willBlurListener) this.willBlurListener.remove()
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

  private onEndReached = () => {
    if (this.props.notificationStore.status === "done") {
      this.props.notificationStore.fetchEarlier()
    }
  }

  render() {
    const { status } = this.props.notificationStore
    return (
      <Screen preset="fixed" style={Style.Screen}>
        <Header headerTx="NotificationScreen.Title" />
        <NotificationList
          sections={this.props.notificationStore.sections}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          refreshControl={
            <RefreshControl
              colors={[color.primary]}
              refreshing={status === "pending"}
              onRefresh={this.props.notificationStore.fetch}
            />
          }
          ListEmptyComponent={
            status === "done-more" && (
              <View style={Style.EmptyView}>
                <Text
                  tx="NotificationScreen.EmptyLabel"
                  style={Style.EmptyLabel}
                />
              </View>
            )
          }
          style={Style.List}
          contentContainerStyle={Style.ListContent}
          onEndReachedThreshold={0.5}
          onEndReached={this.onEndReached}
        />
      </Screen>
    )
  }

  private renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<Notification>
  }) => {
    if (section.key === "read") {
      const [unread] = this.props.notificationStore.itemsSplitByRead
      if (unread.length) {
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
        onPress={
          item.txURL
            ? () => {
                Linking.openURL(item.txURL)
              }
            : null
        }
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
