import { NavigationStackScreenProps } from "react-navigation-stack"

import { UserStore } from "../../models/user-store"

export interface ReferrerInputScreenProps extends NavigationStackScreenProps<{}> {
  userStore: UserStore,
}

export interface ReferrerInputScreenState {
  error: string
  isPosting: boolean
  referrerID: string
}
