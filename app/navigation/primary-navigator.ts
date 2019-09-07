import { createStackNavigator } from "react-navigation"
import { WelcomeScreen } from "../screens/welcome-screen"
import { ContentViewScreen } from "../screens/content-view-screen";

export const PrimaryNavigator = createStackNavigator(
  {
    welcome: { screen: WelcomeScreen },
    contentView: { screen: ContentViewScreen },
  },
  {
    headerMode: "none",
  },
)
