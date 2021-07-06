import { NavigationStackScreenProps } from "react-navigation-stack"

import { NotificationStore } from "../../models/notification-store"
import { UserStore } from "../../models/user-store"

export interface NotificationScreenProps extends NavigationStackScreenProps<{}> {
  notificationStore: NotificationStore
  userStore: UserStore
}
