import { SectionBase } from "react-native"

import { SuperLikeFollowingStore } from "../../models/super-like-following-store"

import { ContentListScreenProps } from "../../components/content-list-screen"

export interface SuperLikeFollowingScreenProps extends ContentListScreenProps {
  superLikeFollowingStore?: SuperLikeFollowingStore
}

export interface ReaderSectionListData<T> extends SectionBase<T> {
  title: string
}
