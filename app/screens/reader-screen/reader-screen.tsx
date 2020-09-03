import * as React from "react"
import { AppState, AppStateStatus } from "react-native"
import { inject } from "mobx-react"

import {
  SuperLikeFollowingScreen,
  SuperLikeFollowingScreenBase,
} from "../super-like-following-screen"

import { ReaderScreenProps as Props } from "./reader-screen.props"

@inject("readerStore")
export class ReaderScreen extends React.Component<Props, {}> {
  appState = AppState.currentState

  superLikeScreen = React.createRef<SuperLikeFollowingScreenBase>()

  componentDidMount() {
    this.props.readerStore.fetchCreatorList()
    this.props.readerStore.fetchBookmarkList()
    AppState.addEventListener("change", this.handleAppStateChange)
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange)
  }

  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      if (this.superLikeScreen.current?.onResume) {
        this.superLikeScreen.current.onResume()
      }
    }
    this.appState = nextAppState
  }

  render() {
    return <SuperLikeFollowingScreen navigation={this.props.navigation} />
  }
}
