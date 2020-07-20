import { SectionBase } from "react-native"

import {
  ContentListScreenProps,
} from "../../components/content-list-screen"

import { User } from "../../models/user"

export interface ReaderScreenProps extends ContentListScreenProps {
  currentUser: User
}

export interface ReaderSectionListData<T> extends SectionBase<T> {
  title: string
}
