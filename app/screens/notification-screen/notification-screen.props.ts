import { NavigationScreenProps } from "react-navigation"

import { NotificationStore } from "../../models/notification-store"
import { UserStore } from "../../models/user-store"

export interface NotificationScreenProps extends NavigationScreenProps<{}> {
  notificationStore: NotificationStore
  userStore: UserStore
}
