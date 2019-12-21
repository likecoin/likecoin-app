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
import { observer } from "mobx-react"

import { Text } from "../text"
import { spacing } from "../../theme"
import { Content } from "../../models/content"
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

export interface ContentListItemProps {
  /**
   * The Content URL.
   */
  content: Content

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle

  /**
   * A callback run when the item is pressed.
   */
  onPressItem?: Function
}

/**
 * List item for displaying content inside list
 */
@observer
export class ContentListItem extends React.Component<ContentListItemProps, {}> {
  componentDidMount() {
    const { content } = this.props
    if (!content.hasFetchedDetails) {
      content.fetchDetails()
    }
    content.fetchLikeStat()
  }

  _onPress = () => {
    this.props.onPressItem(this.props.content)
  }

  render() {
    const { content, style, ...rest } = this.props

    const rootStyle = {
      ...ROOT,
      ...style,
    }

    return (
      <TouchableOpacity
        onPress={this._onPress}
        style={rootStyle}
        {...rest}
      >
        <View style={DETAIL_VIEW}>
          <Text
            color="likeGreen"
            size="default"
            weight="600"
            text={content.creatorLikerID}
          />
          <ReactNativeText style={DETAIL_TEXT}>
            <Text
              color="grey4a"
              size="medium"
              weight="600"
              text={content.title}
            />
            {this._renderLikeStat()}
          </ReactNativeText>
        </View>
        {!!content.imageURL &&
          <Image
            source={{ uri: content.imageURL }}
            style={IMAGE_VIEW}
          />
        }
      </TouchableOpacity>
    )
  }

  _renderLikeStat = () => {
    const { likeCount, likerCount } = this.props.content
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
