import { SectionBase } from "react-native"

import { MySuperLikeFeedStore } from "../../models/my-super-likes-store"

import { ContentListScreenProps } from "../../components/content-list-screen"

export interface SuperLikeFollowingScreenProps extends ContentListScreenProps {
  mySuperLikeFeedStore?: MySuperLikeFeedStore
}

export interface ReaderSectionListData<T> extends SectionBase<T> {
  title: string
}
