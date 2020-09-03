import { NavigationScreenProps } from "react-navigation"

import { ReaderStore } from "../../models/reader-store"

export interface ReaderScreenProps extends NavigationScreenProps {
  readerStore: ReaderStore
}
