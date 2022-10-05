import { NavigationStackScreenProps } from "react-navigation-stack"

import { ContentBookmarksListStore } from "../../models/content-bookmarks-list-store"

export interface ReaderScreenProps extends NavigationStackScreenProps {
  contentBookmarksListStore: ContentBookmarksListStore
}
