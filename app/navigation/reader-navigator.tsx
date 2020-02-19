import * as React from "react"
import { ViewStyle } from "react-native"
import {
  createStackNavigator,
  createMaterialTopTabNavigator,
  NavigationScreenProps,
  NavigationRoute,
  NavigationParams,
  SafeAreaView,
} from "react-navigation"
import { TabBar, Tab } from "react-native-ui-kitten"
import { Icon, IconTypes } from "../components/icon"

import { ReaderScreen } from "../screens/reader-screen"
import { color } from "../theme"

interface ReaderTabBarProps extends NavigationScreenProps<{}> {}

const TAB_BAR_CONTAINER: ViewStyle = {
  backgroundColor: color.primary,
}
const TAB_BAR: ViewStyle = {
  height: 40,
  backgroundColor: TAB_BAR_CONTAINER.backgroundColor,
}
const TAB_BAR_INDICATOR: ViewStyle = {
  backgroundColor: color.palette.likeCyan
}

class ReaderTabBar extends React.Component<ReaderTabBarProps, {}> {
  _onBarSelect = (selectedIndex: number) => {
    const { navigation } = this.props
    navigation.navigate(navigation.state.routes[selectedIndex].routeName)
  }

  render() {
    const { navigation } = this.props
    return (
      <SafeAreaView style={TAB_BAR_CONTAINER}>
        <TabBar
          selectedIndex={this.props.navigation.state.index}
          style={TAB_BAR}
          indicatorStyle={TAB_BAR_INDICATOR}
          onSelect={this._onBarSelect}
        >
          {navigation.state.routes.map(this._renderTab)}
        </TabBar>
      </SafeAreaView>
    )
  }

  _renderTab = (route: NavigationRoute<NavigationParams>, selectedIndex: number) => {
    return (
      <Tab
        key={route.routeName}
        icon={this._renderIcon(selectedIndex)}
      />
    )
  }

  _renderIcon = (index: number) => () => {
    const { navigation } = this.props
    const isSelected = navigation.state.index === index
    const { routeName } = navigation.state.routes[index]
    let name: IconTypes
    switch (routeName) {
      case "Featured":
        name = "reader-featured"
        break
      case "Following":
        name = "reader-following"
        break
    }
    const fill = isSelected ? color.palette.likeCyan : color.palette.white
    return (
      <Icon
        name={name}
        width={24}
        height={24}
        fill={fill}
      />
    )
  }
}

const ReaderTabs = createMaterialTopTabNavigator({
  Featured: ReaderScreen,
  Following: ReaderScreen,
}, {
  tabBarOptions: {
    style: {
      backgroundColor: color.primary,
    },
    indicatorStyle: {
      backgroundColor: color.palette.likeCyan,
    },
  },
  tabBarComponent: ReaderTabBar,
})

export const ReaderNavigator = createStackNavigator({
  ReaderList: ReaderTabs,
}, {
  headerMode: "none",
})
