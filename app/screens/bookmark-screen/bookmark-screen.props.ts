import { NavigationScreenProps } from "react-navigation"

import { ReaderStore } from "../../models/reader-store"

export interface BookmarkScreenProps extends NavigationScreenProps<{}> {
  readerStore: ReaderStore,
}
