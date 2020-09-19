import { NavigationScreenProps } from "react-navigation"

import { CreatorsStore } from "../../models/creators-store"
import { ReaderStore } from "../../models/reader-store"

export interface ReaderScreenProps extends NavigationScreenProps {
  creatorsStore: CreatorsStore
  readerStore: ReaderStore
}
