import { ReaderStore } from "../../models/reader-store"
import { NavigationScreenProps } from "react-navigation"

export interface ReaderScreenProps extends NavigationScreenProps {
  readerStore: ReaderStore
}
