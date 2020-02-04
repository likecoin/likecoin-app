import * as React from "react"
import { ViewStyle } from "react-native"
import {
  createMaterialTopTabNavigator,
  NavigationScreenProps,
  NavigationRoute,
  NavigationParams,
  SafeAreaView,
} from "react-navigation"
import { TabBar, Tab } from "react-native-ui-kitten"

import { AuthcoreProfileSettingsScreen } from "../screens/authcore-profile-settings-screen"
import { AuthcoreSecuritySettingsScreen } from "../screens/authcore-security-settings-screen"

import { color } from "../theme"

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

class AuthcoreSettingsTabBar extends React.Component<NavigationScreenProps> {
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

  _renderTab = (route: NavigationRoute<NavigationParams>) => {
    return (
      <Tab
        key={route.routeName}
        title={route.routeName}
      />
    )
  }
}

export const AuthcoreSettingsTabs = createMaterialTopTabNavigator({
  AuthcoreProfileSettings: AuthcoreProfileSettingsScreen,
  AuthcoreSecuritySettings: AuthcoreSecuritySettingsScreen,
}, {
  tabBarOptions: {
    style: {
      backgroundColor: color.primary,
    },
    indicatorStyle: {
      backgroundColor: color.palette.likeCyan,
    },
  },
  tabBarComponent: AuthcoreSettingsTabBar,
})
