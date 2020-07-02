import { SectionBase } from "react-native"

import { Content } from "../../models/content"
import {
  ContentListScreenProps,
} from "../../components/content-list-screen"

export interface ReaderScreenProps extends ContentListScreenProps {}

export interface ReaderSectionListData extends SectionBase<Content> {
  title: string
}
