import * as React from "react"
import { observer, inject } from "mobx-react"

import {
  AuthcoreSecuritySettingsScreenProps as Props,
} from "./authcore-security-settings-screen.props"

import { AuthcoreWidgetView } from "../../components/authcore-widget-view"

@inject("userStore")
@observer
export class AuthcoreSecuritySettingsScreen extends React.Component<Props> {
  render () {
    const { accessToken } = this.props.userStore.authCore
    return (
      <AuthcoreWidgetView
        baseURL={this.props.userStore.authCore.getBaseURL()}
        accessToken={accessToken}
        page="settings"
      />
    )
  }
}
