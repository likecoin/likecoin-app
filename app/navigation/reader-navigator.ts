import { createStackNavigator } from "react-navigation"

import { ReaderScreen } from "../screens/reader-screen"

export const ReaderNavigator = createStackNavigator(
  {
    Follow: { screen: ReaderScreen },
  },
  {
    headerMode: "none",
    initialRouteName: "Follow",
  },
)
