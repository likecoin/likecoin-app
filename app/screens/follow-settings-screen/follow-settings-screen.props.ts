import { NavigationScreenProps } from "react-navigation"

import { ReaderStore } from "../../models/reader-store"

export interface FollowSettingsScreenProps extends NavigationScreenProps<{}> {
  readerStore: ReaderStore,
}
