import { SectionBase } from "react-native"

import { Content } from "../../models/content"
import { User } from "../../models/user"

import {
  ContentListScreenProps,
} from "../../components/content-list-screen"

export interface ReaderScreenProps extends ContentListScreenProps {
  currentUser: User
}

export interface ReaderSectionListData extends SectionBase<Content> {
  title: string
}
