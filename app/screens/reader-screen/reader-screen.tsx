import * as React from "react"
import {
  Animated,
  AppState,
  AppStateStatus,
  ListViewProps,
  StyleSheet,
} from "react-native"
import { inject } from "mobx-react"
import styled from "styled-components/native"

import {
  SuperLikeFollowingScreen,
  SuperLikeFollowingScreenBase,
} from "../super-like-following-screen"

import { Header } from "../../components/header"
import { HeaderTab, HeaderTabItem } from "../../components/header-tab"
import { Screen as ScreenBase } from "../../components/screen"

import { SuperLikeGlobalFeedScreen } from "../super-like-global-feed-screen"

import { ReaderScreenProps as Props } from "./reader-screen.props"

const Screen = styled(ScreenBase)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`

const ScrollViewContainer = styled.View`
  flex: 1;
`

const HeaderTabShadow = styled(Animated.View)`
  position: absolute;
  z-index: 11;
  left: 0;
  right: 0;
  height: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ theme }) => theme.color.separator};
`

const HeaderTabWrapper = styled.View`
  position: absolute;
  overflow: hidden;
  z-index: 10;
  left: 0;
  right: 0;
  height: 80px;
`

@inject("contentBookmarksListStore", "creatorsStore")
export class ReaderScreen extends React.Component<Props, {}> {
  appState = AppState.currentState

  superLikeScreen = React.createRef<SuperLikeFollowingScreenBase>()

  state = {
    tabValue: "following",
    scrollY: new Animated.Value(0),
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

    const handleScroll = Animated.event([
      {
        nativeEvent: {
          contentOffset: {
            y: this.state.scrollY,
          },
        },
      },
    ], { useNativeDriver: true })
    
    const headerTabViewStyle = {
      transform: [
        {
          translateY: Animated.multiply(
            Animated.diffClamp(
              this.state.scrollY.interpolate({
                inputRange: [-1, 0, 1, 2],
                outputRange: [0, 0, 1, 2],
              }),
              0,
              80
            ),
            -1
          ),
        },
      ]
    }

    const listViewProps: Partial<ListViewProps> = {
      contentInset: { top: 80 },
      contentInsetAdjustmentBehavior: "always",
    }

    return (
      <Screen preset="fixed">
        <Header headerTx={headerTx} />
        <ScrollViewContainer>
          <HeaderTabShadow
            style={{
              opacity: this.state.scrollY.interpolate({
                inputRange: [0, 10, 11, 89.99, 90],
                outputRange: [0, 0.5, 0.5, 0.5, 0],
              }),
            }}
          />
          <HeaderTabWrapper>
            <Animated.View style={headerTabViewStyle}>
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
            </Animated.View>
          </HeaderTabWrapper>
          
          {tabValue === "following" && (
            <SuperLikeFollowingScreen
              navigation={this.props.navigation}
              listViewProps={listViewProps}
              onScroll={handleScroll}
            />
          )}
          {tabValue === "global" && (
            <SuperLikeGlobalFeedScreen
              navigation={this.props.navigation}
              listViewProps={listViewProps}
              onScroll={handleScroll}
            />
          )}
        </ScrollViewContainer>
      </Screen>
    )
  }
}
