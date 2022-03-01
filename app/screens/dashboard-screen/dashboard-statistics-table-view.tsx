import * as React from "react"
import { View, ViewStyle } from "react-native"
import { observer, inject } from "mobx-react"
import styled from "styled-components/native"

import { TableViewCell } from "../../components/table-view/table-view-cell"
import { TableView } from "../../components/table-view/table-view"
import { Text } from "../../components/text"

import {
  StatisticsRewardedStore,
  StatisticsSupportedStore,
} from "../../models/statistics-store"

import { translate } from "../../i18n"

import { formatLikeAmountText } from "../../utils/number"

const TitleText = styled(Text)`
  color: ${props => props.theme.color.text.highlight};
  font-size: ${props => props.theme.text.size.xs};
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.xs};
`

const StatsDetailsContainerView = styled.View`
  flex-direction: row;
`

const StatsDetailsLeftView = styled.View`
  min-width: 156px;
`

const StatsDetailsRightView = styled.View`
  min-width: 44px;
  margin-left: ${props => props.theme.spacing.xl};
`

const StatsValueText = styled(Text)`
  color: ${props => props.theme.color.text.primary};
  font-size: ${props => props.theme.text.size.xl};
  font-weight: 500;
`

const StatsLabelText = styled(Text)`
  color: ${props => props.theme.color.text.secondary};
  font-size: ${props => props.theme.text.size.sm};
`

const RewardContentLeftView = styled.View`
  flex-grow: 1;
`

export interface DashboardStatisticsTableViewProps {
  isCivicLiker?: boolean
  rewardedStatistics?: StatisticsRewardedStore
  supportedStatistics?: StatisticsSupportedStore

  style?: ViewStyle

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
export class DashboardStatisticsTableView extends React.Component<DashboardStatisticsTableViewProps> {
  componentDidMount() {
    this.props.supportedStatistics.fetchLatest()
    this.props.rewardedStatistics.fetchSummary()
  }

  render() {
    return (
      <TableView style={this.props.style}>
        {!!this.props.isCivicLiker && (
          this.renderSupportedSection()
        )}
        {this.renderRewardedSection()}
      </TableView>
    )
  }

  private renderSupportedSection() {
    const {
      likeAmount: supportedLikeAmount = 0,
      worksCount: supportedWorksCount = 0
    } = this.props.supportedStatistics.weekList[0] || {}
    return (
      <TableViewCell onPress={this.props.onPressSupportedSection}>
        <View>
          <TitleText tx="settingsScreen.Panel.Statistics.Supported.Title" />
          <StatsDetailsContainerView>
            <StatsDetailsLeftView>
              <StatsValueText
                text={`${formatLikeAmountText(supportedLikeAmount)} LIKE`}
              />
            </StatsDetailsLeftView>
            <StatsDetailsRightView>
              <StatsValueText
                text={`${supportedWorksCount}`}
              />
              <StatsLabelText
                text={translate("Statistics.Work", { count: supportedWorksCount })}
              />
            </StatsDetailsRightView>
          </StatsDetailsContainerView>
        </View>
      </TableViewCell>
    )
  }

  private renderRewardedSection() {
    const {
      totalLikeAmount: totalRewardedLikeAmount = 0,
    } = this.props.rewardedStatistics
    return (
      <TableViewCell onPress={this.props.onPressRewardedSection}>
        <RewardContentLeftView>
          <TitleText tx="settingsScreen.Panel.Statistics.Rewarded.Title" />
          <StatsDetailsContainerView>
            <StatsDetailsLeftView>
              <StatsValueText
                text={(
                  totalRewardedLikeAmount > 0
                    ? `${formatLikeAmountText(totalRewardedLikeAmount)} LIKE`
                    : "---"
                )}
              />
            </StatsDetailsLeftView>
          </StatsDetailsContainerView>
        </RewardContentLeftView>
      </TableViewCell>
    )
  }
}
