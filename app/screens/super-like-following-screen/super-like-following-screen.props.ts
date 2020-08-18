import { SectionBase } from "react-native"

import { ContentListScreenProps } from "../../components/content-list-screen"

export interface SuperLikeFollowingScreenProps extends ContentListScreenProps {}

export interface ReaderSectionListData<T> extends SectionBase<T> {
  title: string
}
