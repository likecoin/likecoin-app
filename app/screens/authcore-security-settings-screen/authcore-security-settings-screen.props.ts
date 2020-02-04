import { NavigationScreenProps } from "react-navigation"

import { UserStore } from "../../models/user-store"

export interface AuthcoreSecuritySettingsScreenProps extends NavigationScreenProps {
  userStore: UserStore
}
