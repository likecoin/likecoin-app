import * as React from "react"
import { observer } from "mobx-react"

import {
  StatisticsListItem,
} from "../../components/statistics-list-item"

import {
  StatisticsSupportedCreator,
} from "../../models/statistics-store"

import { formatLikeAmountText } from "../../utils/number"

interface StatisticsSupportedCreatorListItemProps {
  creator: StatisticsSupportedCreator
}

@observer
export class StatisticsSupportedCreatorListItem extends
  React.Component<StatisticsSupportedCreatorListItemProps> {
  componentDidMount() {
    const { creator } = this.props
    if (creator.info && !creator.info.hasFetchedDetails) {
      creator.info.fetchDetails()
    }
  }

  render () {
    const { creator } = this.props
    const {
      avatarURL = "",
      displayName = "",
      isCivicLiker = false,
      isFetchingDetails = false,
    } = creator.info || {}
    return (
      <StatisticsListItem
        type="supported-creator"
        avatarURL={avatarURL}
        isCivicLiker={isCivicLiker}
        title={displayName}
        likeAmount={formatLikeAmountText(creator.likeAmount)}
        likeCount={creator.likesCount}
        numOfWorks={creator.worksCount}
        isSkeleton={isFetchingDetails}
      />
    )
  }
}
