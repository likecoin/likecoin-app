import * as React from "react"
import { TouchableHighlight, View } from "react-native"
import moment from "moment"

import { NotificationListItemProps as Props } from "./notification-list-item.props"
import { NotificationListItemStyle as Style } from "./notification-list-item.style"
import { getHeaderIcon } from "./notification-list-item.header-icon"
import { getIcon } from "./notification-list-item.icon"

import { Sheet } from "../sheet"
import { Text } from "../text"
import { translate } from "../../i18n"

export function NotificationListItem(props: Props) {
  const HeaderIcon = getHeaderIcon(props.type)

  const dateTimeString = React.useMemo(() => {
    const today = moment().startOf("day")
    const date = moment(props.ts)
    let dateFormat: string
    if (date.isSameOrAfter(today)) {
      dateFormat = `[${translate("Date.Today")}]`
    } else if (date.isSameOrAfter(today.subtract(1, "day"))) {
      dateFormat = `[${translate("Date.Yesterday")}]`
    } else if (date.isSameOrAfter(today.startOf("year"))) {
      dateFormat = "DD/MM"
    } else {
      dateFormat = "DD/MM/YY"
    }
    return date.format(`${dateFormat} HH:mm`)
  }, [props.ts])

  return (
    <TouchableHighlight>
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
              {props.ts && <Text style={Style.Date} text={dateTimeString} />}
            </View>
            <View style={Style.ChildrenWrapper}>{props.children}</View>
          </View>
        </View>
      </Sheet>
    </TouchableHighlight>
  )
}
