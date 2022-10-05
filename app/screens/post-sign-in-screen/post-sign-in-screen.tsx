import * as React from "react"
import { Alert } from "react-native"
import { NavigationStackScreenProps } from "react-navigation-stack"
import { inject } from "mobx-react"

import { Style } from "./post-sign-in-screen.style"

import { LoadingScreen } from "../../components/loading-screen"

import { UserStore } from "../../models/user-store"
import { DeepLinkHandleStore } from "../../models/deep-link-handle-store"

import { translate } from "../../i18n"

export interface PostSignInScreenProps extends NavigationStackScreenProps<{}> {
  userStore: UserStore
  deepLinkHandleStore: DeepLinkHandleStore
}

@inject("deepLinkHandleStore", "userStore")
export class PostSignInScreen extends React.Component<
  PostSignInScreenProps
> {
  patientTimer?: number

  hasShownErrorAlert = false

  state = {
    loadingScreenText: "",
  }

  componentDidMount() {
    this.patientTimer = setTimeout(() => {
      this.setState({
        loadingScreenText: translate("signInScreen.LoadingTakesLonger"),
      })
    }, 5000)
    this.handlePostSignIn()
  }

  componentWillUnmount() {
    clearTimeout(this.patientTimer)
  }

  private handleError = async () => {
    this.props.navigation.popToTop()
    this.props.userStore.logout()
  }

  private handlePostSignIn = async () => {
    try {
      await Promise.all([
        this.props.userStore.fetchUserInfo(),
        this.props.userStore.appMeta.fetch(),
      ])
      await this.props.userStore.postResume()
      this.props.navigation.navigate("App")

      // Try to open the deferred deep link URL after sign in
      await this.props.deepLinkHandleStore.openBranchDeepLink()
      this.props.deepLinkHandleStore.openDeepLink()
    } catch {
      this.showErrorAlert()
    }
  }

  private showErrorAlert = (message?: string) => {
    if (this.hasShownErrorAlert) return
    this.hasShownErrorAlert = true
    Alert.alert(
      translate("signInScreen.error"),
      message || translate("signInScreen.errorLikerLand"),
      [
        {
          text: translate("common.back"),
          onPress: () => {
            this.hasShownErrorAlert = false
            this.handleError()
          },
        },
      ],
    )
  }

  render() {
    return (
      <LoadingScreen
        text={this.state.loadingScreenText}
        style={Style.LoadingScreen}
      />
    )
  }
}
