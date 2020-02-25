import * as React from "react"
import { View, TouchableOpacity, RefreshControl, ListRenderItem } from "react-native"
import { FlatList } from "react-navigation"
import { inject, observer } from "mobx-react"

import { FollowSettingsScreenProps as Props } from "./follow-settings-screen.props"
import { FollowSettingsScreenState as State } from "./follow-settings-screen.state"
import { FollowSettingsScreenStyle as Style } from "./follow-settings-screen.style"
import { FollowingSettingsListItem } from "./follow-settings-list-item"

import { Header } from "../../components/header"
import { Screen } from "../../components/screen"
import { Text } from "../../components/text"

import { Creator } from "../../models/creator"

import { logAnalyticsEvent } from "../../utils/analytics"
import { color } from "../../theme"

@inject("readerStore")
@observer
export class FollowSettingsScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      currentTab: "follow",
      hasUpdated: false,
    }
  }

  componentDidMount() {
    if (!this.props.readerStore.hasFetchedCreatorList) {
      this.props.readerStore.fetchCreatorList()
    }

    this.props.navigation.addListener("willBlur", this.onWillBlur)
  }

  private onWillBlur = () => {
    // Update following list if any change has made
    if (this.state.hasUpdated) {
      this.props.readerStore.fetchFollowingList()
      this.setState({ hasUpdated: false })
    }
  }

  private onPressBack = () => {
    this.props.navigation.goBack()
  }

  private onPressFollowingTab = () => {
    this.setState({ currentTab: "follow" })
  }

  private onPressUnfollowedTab = () => {
    this.setState({ currentTab: "unfollow" })
  }

  private onFollow = (creator: Creator) => {
    this.props.readerStore.toggleFollow(creator.likerID)
    this.setState({ hasUpdated: true })
    logAnalyticsEvent('FollowSettingsClickFollow')
  }

  private onUnfollow = (creator: Creator) => {
    this.props.readerStore.toggleFollow(creator.likerID)
    this.setState({ hasUpdated: true })
    logAnalyticsEvent('FollowSettingsClickUnfollow')
  }

  private keyExtractor = (creator: Creator) => creator.likerID

  render() {
    const creators = this.state.currentTab === "follow"
      ? this.props.readerStore.followingCreators
      : this.props.readerStore.unfollowedCreators
    return (
      <Screen
        style={Style.Root}
        preset="fixed"
      >
        <Header
          headerTx="FollowSettingsScreen.Title"
          leftIcon="back"
          onLeftPress={this.onPressBack}
        />
        <FlatList
          ListHeaderComponent={this.renderListHeader}
          ListFooterComponent={this.renderListFooter}
          refreshControl={
            <RefreshControl
              colors={[color.primary]}
              refreshing={this.props.readerStore.isFetchingCreatorList}
              onRefresh={this.props.readerStore.fetchCreatorList}
            />
          }
          style={Style.List}
          data={creators}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderListItem}
        />
      </Screen>
    )
  }

  private renderListHeader = () => {
    const { currentTab } = this.state
    return (
      <View style={Style.TabHeader}>
        <TouchableOpacity
          style={[
            Style.TabHeaderButton,
            currentTab === "follow" ? Style.TabHeaderButtonActive : null
          ]}
          onPress={this.onPressFollowingTab}
        >
          <Text
            tx="FollowSettingsScreen.TabTitle.Following"
            color={currentTab === "follow" ? "likeCyan" : "white"}
            weight="600"
            style={Style.TabHeaderButtonTitle}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            Style.TabHeaderButton,
            currentTab === "unfollow" ? Style.TabHeaderButtonActive : null
          ]}
          onPress={this.onPressUnfollowedTab}
        >
          <Text
            tx="FollowSettingsScreen.TabTitle.Unfollowed"
            color={currentTab === "unfollow" ? "likeCyan" : "white"}
            weight="600"
            style={Style.TabHeaderButtonTitle}
          />
        </TouchableOpacity>
      </View>
    )
  }

  private renderListItem: ListRenderItem<Creator> = ({ item: creator }) => {
    return (
      <FollowingSettingsListItem
        key={creator.likerID}
        type={this.state.currentTab}
        creator={creator}
        onPressFollow={this.onFollow}
        onPressUnfollow={this.onUnfollow}
      />
    )
  }

  private renderListFooter = () => <View style={Style.ListFooter} />
}
