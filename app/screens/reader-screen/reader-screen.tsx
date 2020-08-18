import * as React from "react"
import { AppState, AppStateStatus } from "react-native"
import { inject, observer } from "mobx-react"

import {
  SuperLikeFollowingScreen,
  SuperLikeFollowingScreenBase,
} from "../super-like-following-screen"
import {
  ContentFollowingScreen,
  ContentFollowingScreenBase,
} from "../content-following-screen"

import { ReaderScreenProps as Props } from "./reader-screen.props"

@inject("userStore", "readerStore")
@observer
export class ReaderScreen extends React.Component<Props, {}> {
  appState = AppState.currentState

  superLikeScreen = React.createRef<SuperLikeFollowingScreenBase>()

  contentScreen = React.createRef<ContentFollowingScreenBase>()

  get isShowSuperLike() {
    return !!this.props.userStore?.currentUser?.isSuperLiker
  }

  componentDidMount() {
    this.props.readerStore.fetchCreatorList()
    this.props.readerStore.fetchBookmarkList()
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange)
  }

  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === "active" &&
      this.props.readerStore?.getShouldRefreshFollowingFeed()
    ) {
      if (this.isShowSuperLike) {
        this.superLikeScreen.current.onResume()
      } else {
        this.contentScreen.current.onResume()
      }
    }
    this.appState = nextAppState
  }

  render() {
    if (this.isShowSuperLike) {
      return <SuperLikeFollowingScreen navigation={this.props.navigation} />
    }
    return <ContentFollowingScreen navigation={this.props.navigation} />
  }
}
