import { ContentBookmarksListStore } from "../../models/content-bookmarks-list-store"

import { ContentListScreenProps } from "../../components/content-list-screen"

export interface BookmarkScreenProps extends ContentListScreenProps {
  contentBookmarksListStore: ContentBookmarksListStore
}
