import { NavigationScreenProps } from "react-navigation"

import { ContentBookmarksListStore } from "../../models/content-bookmarks-list-store"
import { CreatorsStore } from "../../models/creators-store"

export interface ReaderScreenProps extends NavigationScreenProps {
  creatorsStore: CreatorsStore
  contentBookmarksListStore: ContentBookmarksListStore
}
