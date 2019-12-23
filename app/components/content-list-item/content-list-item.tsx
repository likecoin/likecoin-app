import * as React from "react"
import {
  Image,
  ImageStyle,
  Text as ReactNativeText,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"

import { ContentListItemProps } from "./content-list-item.props"

import { Text } from "../text"
import { spacing } from "../../theme"
import { sizes } from "../text/text.sizes"

const ROOT: ViewStyle = {
  paddingVertical: spacing[2],
  paddingHorizontal: spacing[4],
  flexDirection: "row",
  alignItems: "center",
}
const DETAIL_VIEW: ViewStyle = {
  flex: 1,
}
const DETAIL_TEXT: TextStyle = {
  marginTop: spacing[1],
  lineHeight: sizes.medium * 1.5,
}
const IMAGE_VIEW: ImageStyle = {
  flex: 0,
  width: 64,
  marginLeft: spacing[4],
  aspectRatio: 1,
  resizeMode: "cover",
}

export class ContentListItem extends React.Component<ContentListItemProps, {}> {
  componentDidMount() {
    const {
      hasFetchedDetails,
      onFetchStat,
      onFetchDetails,
      url
    } = this.props
    if (!hasFetchedDetails) {
      if (onFetchDetails) onFetchDetails(url)
    }
    if (onFetchStat) onFetchStat(url)
  }

  private onPress = () => {
    const { onPress, url } = this.props
    if (onPress) onPress(url)
  }

  render() {
    const {
      creatorName,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onPress,
      style,
      thumbnailURL,
      title,
      ...rest
    } = this.props

    const rootStyle = {
      ...ROOT,
      ...style,
    }

    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={rootStyle}
        {...rest}
      >
        <View style={DETAIL_VIEW}>
          <Text
            color="likeGreen"
            size="default"
            weight="600"
            text={creatorName}
          />
          <ReactNativeText style={DETAIL_TEXT}>
            <Text
              color="grey4a"
              size="medium"
              weight="600"
              text={title}
            />
            {this.renderLikeStat()}
          </ReactNativeText>
        </View>
        {!!thumbnailURL &&
          <Image
            source={{ uri: thumbnailURL }}
            style={IMAGE_VIEW}
          />
        }
      </TouchableOpacity>
    )
  }

  private renderLikeStat = () => {
    const { likeCount, likerCount } = this.props
    if (likeCount === 0) return null
    let text = `${likeCount} LIKE`
    if (likerCount > 0) {
      text = `${text} from ${likerCount} liker${likerCount > 1 ? "s" : ""}`
    }
    text = ` | ${text}`
    return (
      <Text
        text={text}
        color="grey9b"
      />
    )
  }
}
