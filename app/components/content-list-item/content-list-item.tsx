import * as React from "react"
import { View, ViewStyle, TouchableOpacity, TextStyle } from "react-native"
import { observer } from "mobx-react"

import { Text } from "../text"
import { spacing } from "../../theme"
import { Content } from "../../models/content"

const ROOT: ViewStyle = {
  paddingHorizontal: spacing[2],
  paddingVertical: spacing[4],
}
const DESCRIPTION: TextStyle = {
  marginTop: spacing[2],
}
const DETAIL: TextStyle = {
  flexDirection: "row",
  justifyContent: "flex-start",
  marginTop: spacing[2],
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
      <TouchableOpacity onPress={this._onPress}>
        <View
          style={rootStyle}
          {...rest}
        >
          <Text
            color="white"
            size="medium"
            weight="bold"
            text={content.title}
          />
          {this._renderDescription(content.description)}
          <View style={DETAIL}>
            <Text
              color="white"
              size="default"
              weight="bold"
              text={content.creatorLikerID}
            />
            {this._renderLikeStat()}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _renderDescription = (text: string) => {
    if (!text || text === "\"\"") return null
    return (
      <Text
        style={DESCRIPTION}
        color="lightGrey"
        text={text}
      />
    )
  }

  _renderLikeStat = () => {
    const { likeCount, likerCount } = this.props.content
    if (likeCount === 0) return null
    let text = `${likeCount} LIKE`
    if (likerCount > 0) {
      text = `${text} from ${likerCount} liker${likerCount > 1 ? "s" : ""}`
    }
    return [
      <Text key="sep" text=" | " color="lightGrey" />,
      <Text key="stat" text={text} color="white" />
    ]
  }
}
