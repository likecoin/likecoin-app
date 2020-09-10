import * as React from "react"
import { Alert } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { LoadingScreen } from "../../components/loading-screen"

import { RootStore } from "../../models/root-store"
import { UserStore } from "../../models/user-store"

import { translate } from "../../i18n"
import { logError } from "../../utils/error"

export interface AuthLoadingScreenProps extends NavigationScreenProps<{}> {
  rootStore: RootStore
  userStore: UserStore
}

@inject((allStore: any) => ({
  rootStore: allStore.rootStore as RootStore,
  userStore: allStore.rootStore.userStore as UserStore,
}))
@observer
export class AuthLoadingScreen extends React.Component<AuthLoadingScreenProps, {}> {
  componentDidMount() {
    this.checkAuthState()
  }

  async checkAuthState() {
    const {
      currentUser: likeCoUser,
      authCore: {
        profile: authcoreUser,
        getIsSettingUp: getIsSettingUpAuthcore,
      },
      iapStore: {
        isEnabled: isEnabledIAP,
        hasSubscription,
      },
    } = this.props.userStore
    if ((getIsSettingUpAuthcore() || authcoreUser) && likeCoUser) {
      try {
        try {
          await this.props.rootStore.handleAfterLikerLandSignIn()
        } catch (err) {
          logError(err)
        }
        await Promise.all([
          this.props.userStore.authCore.fetchCurrentUser(),
          this.props.userStore.fetchUserInfo(),
          this.props.userStore.fetchUserAppMeta(),
          this.props.userStore.fetchLikerLandUserInfo(),
        ])
        // Restore IAP if neccessary
        if (isEnabledIAP && hasSubscription) {
          await this.props.userStore.iapStore.restorePurchases()
        }

        if (this.props.userStore.shouldPromptAppRating) {
          this.promptAppRating()
        }

        this.props.navigation.navigate('App')
        return
      } catch {
        // No-op
      }
    }
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
      <LoadingScreen />
    )
  }
}
