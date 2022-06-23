import * as React from "react"
import {
  AppState,
  AppStateStatus,
} from "react-native"
import { inject } from "mobx-react"
import styled from "styled-components/native"

import {
  MySuperLikeScreen,
  MySuperLikeScreenBase,
} from "../my-super-likes-screen"

import { Header } from "../../components/header"
import { HeaderTabItem } from "../../components/header-tab"
import { Screen as ScreenBase } from "../../components/screen"

import { SuperLikeGlobalFeedScreen } from "../super-like-global-feed-screen"

import { ReaderScreenProps as Props } from "./reader-screen.props"
import { HeaderTabContainerView } from "../../components/header-tab-container-view"

const Screen = styled(ScreenBase)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`

@inject("contentBookmarksListStore", "creatorsStore")
export class ReaderScreen extends React.Component<Props, {}> {
  appState = AppState.currentState

  superLikeScreen = React.createRef<MySuperLikeScreenBase>()

  state = {
    tabValue: "global",
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

    const headerTx = tabValue === "self"
      ? "reader_screen_title_my_feed"
      : "reader_screen_title_global"

    return (
      <Screen preset="fixed">
        <Header headerTx={headerTx} />
        <HeaderTabContainerView
          value={tabValue}
          items={[
            <HeaderTabItem
              key="global"
              value="global"
              icon="global-eye"
              subtitleTx="reader_screen_tab_subtitle_global"
            />,
            <HeaderTabItem
              key="self"
              value="self"
              icon="super-like"
              subtitleTx="reader_screen_tab_subtitle_self"
            />,
          ]}
          onChange={this.onTabChange}
        >
          {({ onScroll, ...props}) => {
            switch (tabValue) {
              case "self":
                return (
                  <MySuperLikeScreen
                    theme={this.props.theme}
                    screenProps={this.props.screenProps}
                    navigation={this.props.navigation}
                    listViewProps={props}
                    onScroll={onScroll}
                  />
                )

              case "global":
                return (
                  <SuperLikeGlobalFeedScreen
                    theme={this.props.theme}
                    screenProps={this.props.screenProps}
                    navigation={this.props.navigation}
                    listViewProps={props}
                    onScroll={onScroll}
                  />
                )

              default:
                return null
            }
          }}
        </HeaderTabContainerView>
      </Screen>
    )
  }
}
