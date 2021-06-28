import * as React from "react"
import { Linking } from "react-native"
import { observer } from "mobx-react"

import {
  StatisticsListItem,
} from "../../components/statistics-list-item"

import {
  StatisticsSupportedContent,
} from "../../models/statistics-store"

import { translate } from "../../i18n"
import { formatLikeAmountText } from "../../utils/number"

interface StatisticsSupportedContentListItemProps {
  content: StatisticsSupportedContent
}

@observer
export class StatisticsSupportedContentListItem extends
  React.Component<StatisticsSupportedContentListItemProps> {
  componentDidMount() {
    const { content } = this.props
    if (content.info?.checkShouldFetchDetails()) {
      content.info.fetchDetails()
    }
  }

  private onPress = () => {
    const { info: { url = "" } = {} } = this.props.content || {}
    if (url) {
      Linking.openURL(this.props.content.info.url)
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
        } = {},
        isFetchingDetails = false
      } = {},
    } = content || {}
    return (
      <StatisticsListItem
        type="supported-content"
        title={title || translate("Statistics.UnknownSource")}
        subtitle={creatorDisplayName}
        likeAmount={formatLikeAmountText(likeAmount)}
        likeCount={likesCount}
        isSkeleton={isFetchingDetails}
        onPress={this.onPress}
      />
    )
  }
}
