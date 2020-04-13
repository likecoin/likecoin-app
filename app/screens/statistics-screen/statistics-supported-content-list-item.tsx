import * as React from "react"
import { observer } from "mobx-react"

import {
  StatisticsListItem,
} from "../../components/statistics-list-item"

import {
  StatisticsSupportedContent,
} from "../../models/statistics-store"

interface StatisticsSupportedContentListItemProps {
  content: StatisticsSupportedContent
}

@observer
export class StatisticsSupportedContentListItem extends
  React.Component<StatisticsSupportedContentListItemProps> {
  componentDidMount() {
    const { content } = this.props
    if (content.info && !content.info.hasFetchedDetails) {
      content.info.fetchDetails()
    }
  }

  render () {
    const { content } = this.props
    const {
      likeAmount = 0,
      likesCount = 0,
      info: {
        title = "",
        creator: {
          displayName: creatorDisplayName = "",
        } = {}
      } = {},
    } = content || {}
    return (
      <StatisticsListItem
        type="supported-content"
        title={title}
        subtitle={creatorDisplayName}
        likeAmount={likeAmount.toFixed(4)}
        likeCount={likesCount}
      />
    )
  }
}
