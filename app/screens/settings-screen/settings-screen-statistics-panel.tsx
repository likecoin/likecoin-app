import * as React from "react"
import { observer, inject } from "mobx-react"
import {
  TouchableHighlight,
  View,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"

import {
  SETTINGS_MENU,
} from "./settings-screen.style"
import {
  SettingsScreenStatisticsPanelStyle as Style,
} from "./settings-screen-statistics-panel.style"

import { Avatar } from "../../components/avatar"
import { Button } from "../../components/button"
import { Icon } from "../../components/icon"
import { Text } from "../../components/text"

import { gradient } from "../../theme"

import {
  StatisticsRewardedStore,
  StatisticsSupportedStore,
} from "../../models/statistics-store"

import { translate } from "../../i18n"

export interface SettingsScreenStatisticsPanelProps {
  isCivicLiker?: boolean
  rewardedStatistics?: StatisticsRewardedStore
  supportedStatistics?: StatisticsSupportedStore

  onPressSupportedSection?: () => void
  onPressRewardedSection?: () => void
  onPressGetRewardsButton?: () => void
}

@inject((allStores: any) => ({
  rewardedStatistics:
    allStores.statisticsRewardedStore as StatisticsRewardedStore,
  supportedStatistics:
    allStores.statisticsSupportedStore as StatisticsSupportedStore,
}))
@observer
export class SettingsScreenStatisticsPanel extends React.Component<SettingsScreenStatisticsPanelProps> {
  componentDidMount() {
    this.props.supportedStatistics.fetchLatest()
    // this.props.supportedStatistics.fetchTopSupportedCreators()
    this.props.rewardedStatistics.fetchSummary()
  }

  render() {
    return (
      <View style={Style.Root}>
        <Text
          tx="Statistics.Period.Week.This"
          style={Style.Label}
        />
        <View style={[SETTINGS_MENU.TABLE, Style.Table]}>
          {this.props.isCivicLiker ? (
            this.renderSupportedSection()
          ) : (
            this.renderTopSupportedCreator()
          )}
          {this.renderRewardedSection()}
        </View>
      </View>
    )
  }

  private renderTopSupportedCreator() {
    const [topSupportedCreator] =
      this.props.supportedStatistics.topSupportedCreators
    if (!topSupportedCreator) {
      return null
    }

    const {
      displayName = "",
      isCivicLiker = false,
      avatarURL = "",
    } = topSupportedCreator || {}
    return (
      <TouchableHighlight
        underlayColor={Style.ButtonUnderlaying.backgroundColor}
        style={SETTINGS_MENU.TABLE_CELL_FIRST_CHILD}
      >
        <LinearGradient
          colors={gradient.LikeCoin}
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 0.0 }}
          style={Style.Button}
        >
          <View style={Style.ButtonContent}>
            <View style={Style.TopSupportedCreatorIdentity}>
              <Avatar
                src={avatarURL}
                size={40}
                isCivicLiker={isCivicLiker}
                style={Style.TopSupportedCreatorAvatar}
              />
              <Text
                text={displayName}
                color="grey4a"
                size="medium-large"
              />
            </View>
            <Text
              text={translate("settingsScreen.StatisticsPanel.TopSupportedCreator.SupportMore", {
                creator: displayName
              })}
              color="grey4a"
              size="medium-large"
              weight="500"
              style={Style.ButtonTitle}
            />
            <Text
              tx="settingsScreen.StatisticsPanel.TopSupportedCreator.BecomeCivicLiker"
              color="likeGreen"
              size="default"
              weight="500"
            />
          </View>
          <Icon name="arrow-right" color="likeGreen" />
        </LinearGradient>
      </TouchableHighlight>
    )
  }

  private renderSupportedSection() {
    const {
      likeAmount: supportedLikeAmount = 0,
      worksCount: supportedWorksCount = 0
    } = this.props.supportedStatistics.weekList[0] || {}
    return (
      <TouchableHighlight
        underlayColor={Style.ButtonUnderlaying.backgroundColor}
        style={SETTINGS_MENU.TABLE_CELL_FIRST_CHILD}
        onPress={this.props.onPressSupportedSection}
      >
        <View style={Style.Button}>
          <View style={Style.ButtonContent}>
            <Text
              tx="settingsScreen.StatisticsPanel.Supported.Title"
              style={Style.ButtonTitle}
            />
            <View style={Style.ButtonStatsDetails}>
              <View style={Style.ButtonStatsDetailsLeft}>
                <Text
                  text={`${supportedLikeAmount.toFixed(4)} LIKE`}
                  style={Style.ButtonStatsDetailsTitle}
                />
              </View>
              <View style={Style.ButtonStatsDetailsRight}>
                <Text
                  text={`${supportedWorksCount}`}
                  style={Style.ButtonStatsDetailsTitle}
                />
                <Text
                  text={translate("Statistics.Work", { count: supportedWorksCount })}
                  style={Style.ButtonStatsDetailsSubtitle}
                />
              </View>
            </View>
          </View>
          <Icon name="arrow-right" color="grey9b" />
        </View>
      </TouchableHighlight>
    )
  }

  private renderRewardedSection() {
    const {
      totalLikeAmount: totalRewardedLikeAmount = 0,
    } = this.props.rewardedStatistics
    return (
      <TouchableHighlight
        underlayColor={Style.ButtonUnderlaying.backgroundColor}
        style={SETTINGS_MENU.TABLE_CELL_LAST_CHILD}
        onPress={this.props.onPressRewardedSection}
      >
        <View style={Style.Button}>
          <View style={Style.ButtonContent}>
            <Text
              tx="settingsScreen.StatisticsPanel.Rewarded.Title"
              style={Style.ButtonTitle}
            />
            <View style={Style.ButtonStatsDetails}>
              <View style={Style.ButtonStatsDetailsLeft}>
                <Text
                  text={(
                    totalRewardedLikeAmount > 0
                      ? `${totalRewardedLikeAmount.toFixed(4)} LIKE`
                      : "---"
                  )}
                  style={Style.ButtonStatsDetailsTitle}
                />
              </View>
            </View>
          </View>
          {totalRewardedLikeAmount === 0 && (
            <Button
              preset="plain"
              tx="settingsScreen.StatisticsPanel.Rewarded.GetRewardsButtonTitle"
              color="likeCyan"
              weight="500"
              onPress={this.props.onPressGetRewardsButton}
            />
          )}
          <Icon name="arrow-right" color="grey9b" />
        </View>
      </TouchableHighlight>
    )
  }
}
