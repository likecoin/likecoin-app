import { ContentBookmarksListStore } from "../../models/content-bookmarks-list-store"

import { ContentListScreenProps } from "../../components/content-list-screen"

export interface BookmarkArchivesScreenProps extends ContentListScreenProps {
  contentBookmarksListStore: ContentBookmarksListStore
}
