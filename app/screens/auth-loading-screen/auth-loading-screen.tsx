import * as React from "react"
import { NavigationScreenProps } from "react-navigation"
import { inject, observer } from "mobx-react"

import { LoadingScreen } from "../../components/loading-screen"
import { UserStore } from "../../models/user-store"

export interface AuthLoadingScreenProps extends NavigationScreenProps<{}> {
  userStore: UserStore
}

@inject("userStore")
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
      },
      iapStore: {
        isEnabled: isEnabledIAP,
        hasSubscription,
      },
    } = this.props.userStore
    if (authcoreUser && likeCoUser) {
      try {
        await Promise.all([
          this.props.userStore.fetchUserInfo(),
          this.props.userStore.fetchLikerLandUserInfo(),
          this.props.userStore.authCore.fetchCurrentUser(),
        ])
        // Restore IAP if neccessary
        if (isEnabledIAP && hasSubscription) {
          await this.props.userStore.iapStore.restorePurchases()
        }
        this.props.navigation.navigate('App')
        return
      } catch {
        // No-op
      }
    }
    this.props.navigation.navigate('Auth')
  }

  render() {
    return (
      <LoadingScreen />
    )
  }
}
