import { NavigationScreenProps } from "react-navigation"

import { UserStore } from "../../models/user-store"

export interface AuthcoreProfileSettingsScreenProps extends NavigationScreenProps {
  userStore: UserStore
}
