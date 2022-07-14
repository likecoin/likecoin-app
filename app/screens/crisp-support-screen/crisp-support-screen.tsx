import { inject, observer } from "mobx-react"
import * as React from "react"
import { ViewStyle } from "react-native"
import { WebView } from "react-native-webview"
import { NavigationStackScreenProps } from "react-navigation-stack"

import { UserStore } from "../../models/user-store"

import { COMMON_API_CONFIG } from "../../services/api/api-config"

import { Header } from "../../components/header"
import { Screen } from "../../components/screen"

import { color } from "../../theme"

const FULL: ViewStyle = { flex: 1 }

export interface CrispSupportScreenProps extends NavigationStackScreenProps<{}> {
  userStore: UserStore
}

@inject("userStore")
@observer
export class CrispSupportScreen extends React.Component<CrispSupportScreenProps, {}> {
  private goBack = () => {
    this.props.navigation.goBack()
  }

  render() {
    return (
      <Screen
        preset="fixed"
        backgroundColor={color.primary}
        style={FULL}
      >
        <Header
          leftIcon="back"
          onLeftPress={this.goBack}
        />
        <WebView
          source={{ uri: this.props.userStore.crispChatEmbeddedURL }}
          // TODO: remove HACK after applicationNameForUserAgent type is fixed
          {...{ applicationNameForUserAgent: COMMON_API_CONFIG.userAgent }}
        />
      </Screen>
    )
  }
}
