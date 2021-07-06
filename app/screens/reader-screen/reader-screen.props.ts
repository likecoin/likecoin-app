import { NavigationStackScreenProps } from "react-navigation-stack"

import { ContentBookmarksListStore } from "../../models/content-bookmarks-list-store"
import { CreatorsStore } from "../../models/creators-store"

export interface ReaderScreenProps extends NavigationStackScreenProps {
  creatorsStore: CreatorsStore
  contentBookmarksListStore: ContentBookmarksListStore
}
