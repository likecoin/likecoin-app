import * as React from "react"
import { Linking } from "react-native"
import { observer } from "mobx-react"

import {
  StatisticsListItem,
  StatisticsListItemType,
} from "../../components/statistics-list-item"

import {
  StatisticsRewardedContent,
} from "../../models/statistics-store"

import { translate } from "../../i18n"

import { formatLikeAmountText } from "../../utils/number"

interface StatisticsContentListItemProps {
  content: StatisticsRewardedContent
  type: StatisticsListItemType
}

@observer
export class StatisticsRewardedContentListItem extends
  React.Component<StatisticsContentListItemProps> {
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
    const { content, type } = this.props
    const {
      likeAmount = 0,
      likesCount = 0,
      basicLikersCount = 0,
      civicLikersCount = 0,
      info: {
        title = "",
        creator: {
          displayName: creatorDisplayName = "",
        } = {}
      } = {},
    } = content || {}
    return (
      <StatisticsListItem
        type={type}
        title={title || translate("Statistics.UnknownSource")}
        subtitle={creatorDisplayName}
        likeAmount={formatLikeAmountText(likeAmount)}
        likeCount={likesCount}
        numOfLiker={basicLikersCount}
        numOfCivicLiker={civicLikersCount}
        onPress={this.onPress}
      />
    )
  }
}
