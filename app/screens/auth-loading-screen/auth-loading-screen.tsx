import * as React from "react"
import { Alert } from "react-native"
import { NavigationStackScreenProps } from "react-navigation-stack"
import { inject, observer } from "mobx-react"

import { LoadingScreen } from "../../components/loading-screen"

import { DeepLinkHandleStore } from "../../models/deep-link-handle-store"
import { UserStore } from "../../models/user-store"

import { translate } from "../../i18n"
import { logError } from "../../utils/error"
import { ChainStore } from "../../models/chain-store"

export interface AuthLoadingScreenProps extends NavigationStackScreenProps<{}> {
  chainStore: ChainStore
  deepLinkHandleStore: DeepLinkHandleStore
  userStore: UserStore
}

@inject("deepLinkHandleStore", "userStore", "chainStore")
@observer
export class AuthLoadingScreen extends React.Component<AuthLoadingScreenProps, {}> {
  componentDidMount() {
    this.checkAuthState()
  }

  async checkAuthState() {
    const {
      currentUser: likeCoUser,
      iapStore: {
        isEnabled: isEnabledIAP,
        hasSubscription,
      },
    } = this.props.userStore
    if (likeCoUser) {
      try {
        this.props.userStore.setIsSigningIn(true)
        this.props.userStore.authCore.resume().then(() => {
          if (this.props.userStore.isSigningIn) {
            const address = this.props.userStore.authCore.primaryCosmosAddress
            this.props.chainStore.setupWallet(address)
          } else {
            // Reset Authcore login state if user is currently not signing in
            this.props.userStore.authCore.setHasSignedIn(false)
          }
        })
        try {
          await this.props.deepLinkHandleStore.handleAppReferrer()
          await this.props.deepLinkHandleStore.openBranchDeepLink()
        } catch (err) {
          logError(err)
        }
        await Promise.all([
          this.props.userStore.authCore.fetchCurrentUser(),
          this.props.userStore.fetchUserInfo(),
          this.props.userStore.appMeta.fetch(),
        ])
        // Restore IAP if neccessary
        if (isEnabledIAP && hasSubscription) {
          await this.props.userStore.iapStore.restorePurchases()
        }
        await this.props.userStore.postResume()

        if (this.props.userStore.shouldPromptAppRating) {
          this.promptAppRating()
        }

        this.props.navigation.navigate('App')
        return
      } catch (error) {
        logError(error)
      }
    }
    this.props.userStore.setIsSigningIn(false)
    this.props.userStore.authCore.setHasSignedIn(false)
    this.props.navigation.navigate('Auth')
  }

  private promptAppRating() {
    this.props.userStore.didPromptAppRating()
    setTimeout(() => {
      Alert.alert(
        translate("AppRatingPrompt.Title"),
        undefined,
        [
          {
            text: translate("common.No"),
            style: "cancel",
            onPress: () => {
              Alert.alert(
                translate("AppRatingPrompt.DenialTitle"),
                undefined,
                [
                  {
                    text: translate("common.No"),
                    style: "cancel",
                  },
                  {
                    text: translate("common.ok"),
                    onPress: () => {
                      this.props.navigation.navigate("CrispSupport")
                    },
                  },
                ],
              )
            },
          },
          {
            text: translate("common.Yes"),
            onPress: this.props.userStore.rateApp,
          }
        ]
      )
    }, 5000)
  }

  render() {
    return (
      <LoadingScreen tx="signingIn" />
    )
  }
}
