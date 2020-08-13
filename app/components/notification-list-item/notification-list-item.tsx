import * as React from "react"
import { TouchableOpacity, View } from "react-native"

import { NotificationListItemProps as Props } from "./notification-list-item.props"
import { NotificationListItemStyle as Style } from "./notification-list-item.style"
import { getHeaderIcon } from "./notification-list-item.header-icon"
import { getIcon } from "./notification-list-item.icon"

import { Sheet } from "../sheet"
import { Text } from "../text"

export function NotificationListItem(props: Props) {
  const HeaderIcon = getHeaderIcon(props.type)
  return (
    <TouchableOpacity disabled={!props.onPress} onPress={props.onPress}>
      <Sheet preset="flat" style={[Style.Sheet, props.style]}>
        <View style={Style.Layout}>
          <View style={Style.LayoutLeft}>
            {props.iconView || getIcon(props.type)}
          </View>
          <View style={Style.LayoutRight}>
            <View style={Style.Header}>
              <View style={Style.HeaderLeft}>
                {HeaderIcon && (
                  <HeaderIcon width={12} style={Style.HeaderIcon} />
                )}
                <Text
                  tx={`Notification.Type.${props.type}`}
                  style={Style.HeaderText}
                />
              </View>
              {props.dateString && <Text style={Style.Date} text={props.dateString} />}
            </View>
            <View style={Style.ChildrenWrapper}>{props.children}</View>
          </View>
        </View>
      </Sheet>
    </TouchableOpacity>
  )
}
