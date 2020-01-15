import * as React from "react"
import {
  Image,
  TouchableOpacity,
  View,
} from "react-native"
import { observer } from "mobx-react"

import { ContentListItemProps } from "./content-list-item.props"
import { ContentListItemSkeleton } from "./content-list-item.skeleton"
import Style from "./content-list-item.styles"

import { Icon } from "../icon"
import { Text } from "../text"
import { translate } from "../../i18n"

@observer
export class ContentListItem extends React.Component<ContentListItemProps> {
  componentDidMount() {
    if (this.props.content.shouldFetchDetails) {
      this.props.content.fetchDetails()
    }
    this.fetchCreatorDependedDetails()
  }

  componentDidUpdate() {
    this.fetchCreatorDependedDetails()
  }

  private fetchCreatorDependedDetails() {
    if (this.props.content.shouldFetchLikeStat) {
      this.props.content.fetchLikeStat()
    }
    if (this.props.content.shouldFetchCreatorDetails) {
      this.props.content.creator.fetchDetails()
    }
  }

  private onPress = () => {
    if (this.props.onPress) this.props.onPress(this.props.content.url)
  }

  render() {
    const {
      content,
      style,
    } = this.props

    const {
      isLoading,
      likeCount,
      imageURL: thumbnailURL,
      title,
    } = content

    if (isLoading) {
      return <ContentListItemSkeleton />
    }

    const rootStyle = {
      ...Style.ROOT,
      ...style,
    }

    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={rootStyle}
      >
        <View style={Style.ROW}>
          <View style={Style.DETAIL_VIEW}>
            {content.creator && content.creator.hasFetchedDetails &&
              <Text
                color="likeGreen"
                size="default"
                weight="600"
                text={content.creator.displayName}
              />
            }
            <Text
              color="grey4a"
              size="medium"
              weight="600"
              text={title}
              style={Style.DETAIL_TEXT}
            />
          </View>
          {!!thumbnailURL &&
            <Image
              source={{ uri: thumbnailURL }}
              style={Style.IMAGE_VIEW}
            />
          }
        </View>
        {likeCount > 0 &&
          <View style={Style.ROW}>
            <Text
              text={translate("ContentListItem.likeStatsLabel", { count: likeCount })}
              size="medium"
              prepend={(
                <Icon
                  name="like-clap"
                  width={24}
                  color="grey9b"
                />
              )}
              color="grey9b"
            />
          </View>
        }
      </TouchableOpacity>
    )
  }
}
