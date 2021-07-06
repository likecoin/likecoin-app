import { createStackNavigator } from "react-navigation-stack"

import { BookmarkScreen } from "../screens/bookmark-screen"
import { BookmarkArchivesScreen } from "../screens/bookmark-archives-screen"

export const BookmarksNavigator = createStackNavigator(
  {
    Bookmarks: {
      screen: BookmarkScreen,
    },
    BookmarkArchives: {
      screen: BookmarkArchivesScreen,
    },
  },
  {
    headerMode: "none",
    initialRouteName: "Bookmarks",
  },
)
