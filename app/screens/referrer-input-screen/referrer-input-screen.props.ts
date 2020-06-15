import { NavigationScreenProps } from "react-navigation"

import { UserStore } from "../../models/user-store"

export interface ReferrerInputScreenProps extends NavigationScreenProps<{}> {
  userStore: UserStore,
}

export interface ReferrerInputScreenState {
  error: string
  isPosting: boolean
  referrerID: string
}
