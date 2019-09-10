import {
  createStackNavigator,
  createMaterialTopTabNavigator,
} from "react-navigation"

import { ReaderScreen } from "../screens/reader-screen"
import { color } from "../theme"

const ReaderTabs = createMaterialTopTabNavigator({
  Featured: ReaderScreen,
  Followed: ReaderScreen,
}, {
  tabBarOptions: {
    style: {
      backgroundColor: color.primary,
    },
    indicatorStyle: {
      backgroundColor: color.palette.likeCyan,
    },
  },
})

export const ReaderNavigator = createStackNavigator({
  ReaderList: ReaderTabs,
},
{
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: color.primary,
      height: 0,
    },
  },
})
