import { ActionSheetProps } from "@expo/react-native-action-sheet"

import { ReaderStore } from "../../models/reader-store"
import { NavigationScreenProps } from "react-navigation"

export interface ReaderScreenProps extends NavigationScreenProps, ActionSheetProps {
  readerStore: ReaderStore
}
