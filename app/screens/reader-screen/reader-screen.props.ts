import { SectionBase } from "react-native"
import { NavigationScreenProps } from "react-navigation"

import { Content } from "../../models/content"
import { ReaderStore } from "../../models/reader-store"

export interface ReaderScreenProps extends NavigationScreenProps {
  readerStore: ReaderStore
}

export interface ReaderSectionListData extends SectionBase<Content> {
  title: string
}
