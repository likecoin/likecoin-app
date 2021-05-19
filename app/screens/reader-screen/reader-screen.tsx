import * as React from "react"
import { AppState, AppStateStatus } from "react-native"
import { inject } from "mobx-react"
import styled from "styled-components/native"

import {
  SuperLikeFollowingScreen,
  SuperLikeFollowingScreenBase,
} from "../super-like-following-screen"

import { Header } from "../../components/header"
import { HeaderTab as HeaderTabBase, HeaderTabItem } from "../../components/header-tab"
import { Screen as ScreenBase } from "../../components/screen"

import { SuperLikeGlobalFeedScreen } from "../super-like-global-feed-screen"

import { ReaderScreenProps as Props } from "./reader-screen.props"

const Screen = styled(ScreenBase)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`

const HeaderTab = styled(HeaderTabBase)`
  flex-grow: 0;
  flex-shrink: 0;
`

@inject("contentBookmarksListStore", "creatorsStore")
export class ReaderScreen extends React.Component<Props, {}> {
  appState = AppState.currentState

  superLikeScreen = React.createRef<SuperLikeFollowingScreenBase>()

  state = {
    tabValue: "following"
  }

  componentDidMount() {
    this.props.creatorsStore.fetchCreators()
    this.props.contentBookmarksListStore.fetch()
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

  private onTabChange = (value: string) => {
    this.setState({ tabValue: value })
  }

  render() {
    const { tabValue } = this.state

    const headerTx = tabValue === "following"
      ? "reader_screen_title_following"
      : "reader_screen_title_global"
    return (
      <Screen preset="fixed">
        <Header headerTx={headerTx} />
        <HeaderTab
          value={tabValue}
          onChange={this.onTabChange}
        >
          <HeaderTabItem
            value="following"
            icon="super-like"
            subtitleTx="reader_screen_tab_subtitle_following"
          />
          <HeaderTabItem
            value="global"
            icon="global-eye"
            subtitleTx="reader_screen_tab_subtitle_global"
          />
        </HeaderTab>
        {tabValue === "following" && (
          <SuperLikeFollowingScreen navigation={this.props.navigation} />
        )}
        {tabValue === "global" && (
          <SuperLikeGlobalFeedScreen navigation={this.props.navigation} />
        )}
      </Screen>
    )
  }
}
