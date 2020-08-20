import { NavigationScreenProps } from "react-navigation"

import { ReaderStore } from "../../models/reader-store"
import { UserStore } from "../../models/user-store"

export interface ReaderScreenProps extends NavigationScreenProps {
  readerStore: ReaderStore
  userStore: UserStore
}
