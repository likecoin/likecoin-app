import { createStackNavigator } from "react-navigation"

import { SuperLikeGlobalFeedScreen } from "../screens/super-like-global-feed-screen"
import { ReaderScreen } from "../screens/reader-screen"

export const ReaderNavigator = createStackNavigator(
  {
    SuperLikeGlobalFeed: {
      screen: SuperLikeGlobalFeedScreen,
    },
    FollowingFeed: {
      screen: ReaderScreen,
    },
  },
  {
    headerMode: "none",
    initialRouteName: "FollowingFeed",
  },
)
