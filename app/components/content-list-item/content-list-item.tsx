import * as React from "react"
import { View, ViewStyle, TouchableOpacity, TextStyle } from "react-native"
import { observer } from "mobx-react";

import { Text } from "../text"
import { spacing } from "../../theme"
import { Content } from "../../models/content";

const ROOT: ViewStyle = {
  marginVertical: spacing[4],
  marginHorizontal: spacing[2],
}
const TITLE: TextStyle = {
  fontSize: 16,
  fontWeight: "bold",
}
const DESCRIPTION: TextStyle = {
  fontSize: 12,
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
    const { content } = this.props;
    if (content && !content.hasFetchedDetails) {
      this.props.content.fetchDetails()
    }
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
            style={TITLE}
            text={content.title}
          />
          <Text
            style={DESCRIPTION}
            text={content.description}
          />
        </View>
      </TouchableOpacity>
    )
  }
}
