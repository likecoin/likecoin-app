import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { WebView } from "react-native-webview"
import { inject, observer } from "mobx-react"

import { RootStore } from "../../models/root-store"
import { UserStore } from "../../models/user-store"

import { COMMON_API_CONFIG } from "../../services/api/api-config"

import { Header } from "../../components/header"
import { Screen } from "../../components/screen"

import { color } from "../../theme"

const FULL: ViewStyle = { flex: 1 }

export interface CrispSupportScreenProps extends NavigationScreenProps<{}> {
  userStore: UserStore
  CRISP_WEBSITE_ID?: string
}

@inject((allStores: any) => ({
  userStore: allStores.userStore as UserStore,
  CRISP_WEBSITE_ID: (allStores.rootStore as RootStore).env.appConfig.getValue("CRISP_WEBSITE_ID"),
}))
@observer
export class CrispSupportScreen extends React.Component<CrispSupportScreenProps, {}> {
  private goBack = () => {
    this.props.navigation.goBack()
  }

  render() {
    const { CRISP_WEBSITE_ID } = this.props
    const { email } = this.props.userStore.currentUser || {}
    const { primaryPhone } = this.props.userStore.authCore.profile || {}
    let uri = CRISP_WEBSITE_ID ? `https://go.crisp.chat/chat/embed/?website_id=${CRISP_WEBSITE_ID}` : 'https://help.like.co'
    if (CRISP_WEBSITE_ID) {
      if (email) uri += `&email=${encodeURIComponent(email)}`
      if (primaryPhone) uri += `&phone=${encodeURIComponent(primaryPhone)}`
    }
    console.log(uri)
    return (
      <Screen
        preset="fixed"
        backgroundColor={color.primary}
        style={FULL}
      >
        <Header
          leftIcon="close"
          onLeftPress={this.goBack}
        />
        <WebView
          source={{ uri }}
          // TODO: remove HACK after applicationNameForUserAgent type is fixed
          {...{ applicationNameForUserAgent: COMMON_API_CONFIG.userAgent }}
        />
      </Screen>
    )
  }
}
