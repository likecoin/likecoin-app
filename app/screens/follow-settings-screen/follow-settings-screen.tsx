import * as React from "react"
import { Animated, ListRenderItem, RefreshControl } from "react-native"
import { FlatList } from "react-navigation"
import { inject, observer } from "mobx-react"
import styled from "styled-components/native"

import { logAnalyticsEvent } from "../../utils/analytics"
import { color } from "../../theme"

import { Creator } from "../../models/creator"

import { Header } from "../../components/header"
import { HeaderTabContainerView } from "../../components/header-tab-container-view"
import { HeaderTabItem } from "../../components/header-tab"
import { Screen as ScreenBase } from "../../components/screen"
import { TableViewSeparator } from "../../components/table-view/table-view"

import { FollowSettingsScreenProps as Props } from "./follow-settings-screen.props"
import { FollowSettingsScreenState as State } from "./follow-settings-screen.state"
import { FollowingSettingsListItem } from "./follow-settings-list-item"
import { FollowSettingsTabType } from "./follow-settings-screen.type"

const Screen = styled(ScreenBase)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.feature.primary};
`
const AnimatedFlatList = styled(Animated.createAnimatedComponent(FlatList))`
  flex: 1;
  padding: 0 ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.color.background.secondary};
`

const ListVeritcalPadding = styled.View`
  padding-top: ${({ theme }) => theme.spacing.md};
`

@inject("creatorsStore")
@observer
export class FollowSettingsScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      currentTab: "follow",
    }
  }

  private get creators() {
    return this.state.currentTab === "follow"
    ? this.props.creatorsStore.followingCreators
    : this.props.creatorsStore.unfollowedCreators
  }

  private onPressBack = () => {
    this.props.navigation.goBack()
  }

  private onTabChange = (value: FollowSettingsTabType) => {
    this.setState({ currentTab: value })
  }

  private onFollow = (creator: Creator) => {
    creator.follow()
    logAnalyticsEvent('FollowSettingsClickFollow')
  }

  private onUnfollow = (creator: Creator) => {
    creator.unfollow()
    logAnalyticsEvent('FollowSettingsClickUnfollow')
  }

  private keyExtractor = (creator: Creator) => creator.likerID

  private renderListItem: ListRenderItem<Creator> = ({ item: creator, index }) => {
    return (
      <FollowingSettingsListItem
        type={this.state.currentTab}
        creator={creator}
        isFirstCell={index === 0}
        isLastCell={index === this.creators.length - 1}
        onPressFollow={this.onFollow}
        onPressUnfollow={this.onUnfollow}
      />
    )
  }

  render() {
    return (
      <Screen preset="fixed">
        <Header
          headerTx="FollowSettingsScreen.Title"
          leftIcon="back"
          onLeftPress={this.onPressBack}
        />
        <HeaderTabContainerView
          value={this.state.currentTab}
          items={[
            <HeaderTabItem
              key="follow"
              value="follow"
              icon="reader-following"
              subtitleTx="FollowSettingsScreen.TabTitle.Following"
            />,
            <HeaderTabItem
              key="unfollow"
              value="unfollow"
              icon="seen"
              subtitleTx="FollowSettingsScreen.TabTitle.Unfollowed"
            />
          ]}
          onChange={this.onTabChange}
        >
          {(props) => (
            <AnimatedFlatList
              {...props}
              refreshControl={
                <RefreshControl
                  colors={[color.primary]}
                  refreshing={this.props.creatorsStore.isFetching}
                  onRefresh={this.props.creatorsStore.fetchCreators}
                />
              }
              data={this.creators}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderListItem}
              ListHeaderComponent={ListVeritcalPadding}
              ListFooterComponent={ListVeritcalPadding}
              ItemSeparatorComponent={TableViewSeparator}
            />
          )}
        </HeaderTabContainerView>
      </Screen>
    )
  }
}
