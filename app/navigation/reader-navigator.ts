import { createStackNavigator } from "react-navigation"

import {
  GlobalSuperLikedFeedScreen,
} from "../screens/global-superliked-feed-screen"
import { ReaderScreen } from "../screens/reader-screen"

export const ReaderNavigator = createStackNavigator(
  {
    GlobalSuperLikedFeed: {
      screen: GlobalSuperLikedFeedScreen,
    },
    PersonalFeed: {
      screen: ReaderScreen,
    },
  },
  {
    headerMode: "none",
    initialRouteName: "PersonalFeed",
  },
)
