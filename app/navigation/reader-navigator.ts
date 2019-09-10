import {
  createStackNavigator,
  createMaterialTopTabNavigator,
} from "react-navigation"

import { ReaderSuggestScreen } from "../screens/reader-suggest-screen"
import { color } from "../theme"

const ReaderTabs = createMaterialTopTabNavigator({
  Featured: ReaderSuggestScreen,
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
