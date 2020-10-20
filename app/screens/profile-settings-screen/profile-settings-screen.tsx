import * as React from "react"
import { inject, observer } from "mobx-react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"

import { UserStore } from "../../models/user-store"

import { color } from "../../theme"

import { Screen } from "../../components/screen"
import { Header } from "../../components/header"

export interface ProfileSettingsScreenProps extends NavigationScreenProps<{}> {
  userStore: UserStore
}

const Full: ViewStyle = {
  flex: 1,
}

@inject("userStore")
@observer
export class ProfileSettingsScreen extends React.Component<
  ProfileSettingsScreenProps,
  {}
> {
  private onPressCloseButton = () => {
    this.props.navigation.goBack()
  }

  render() {
    const {
      defaultWidgetOptions,
      getClient,
    } = this.props.userStore.authCore
    const { ProfileScreen } = getClient()
    return (
      <Screen preset="fixed" backgroundColor={color.primary} style={Full}>
        <Header
          headerTx="ProfileSettingsScreen.Title"
          leftIcon="back"
          onLeftPress={this.onPressCloseButton}
        />
        <ProfileScreen
          containerStyle={Full}
          {...defaultWidgetOptions}
        />
      </Screen>
    )
  }
}
