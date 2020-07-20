import * as React from "react"
import { View, ViewStyle, TextStyle } from "react-native"

import { HeaderProps } from "./header.props"

import { Button } from "../button"
import { Text } from "../text"
import { sizes } from "../text/text.sizes"

import { spacing, color } from "../../theme"
import { translate } from "../../i18n/"

// static styles
const ROOT: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  minHeight: 44,
}
const TITLE: TextStyle = {
  textAlign: "center",
  color: color.palette.white,
  fontSize: sizes.medium,
  fontWeight: "bold",
}
const TITLE_MIDDLE: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  padding: spacing[2],
}
const LEFT: ViewStyle = { width: 40 }
const RIGHT: ViewStyle = { width: 40 }

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export class Header extends React.Component<HeaderProps, {}> {
  render() {
    const {
      onLeftPress,
      onRightPress,
      rightIcon,
      rightView,
      leftIcon,
      leftView,
      headerText,
      headerTx,
      titleStyle,
    } = this.props
    const header = headerText || (headerTx && translate(headerTx)) || ""

    return (
      <View style={{ ...ROOT, ...this.props.style }}>
        {leftIcon ? (
          <Button
            preset="icon"
            icon={leftIcon}
            onPress={onLeftPress}
          />
        ) : (
          <View style={LEFT}>
            {leftView}
          </View>
        )}
        <View style={TITLE_MIDDLE}>
          <Text
            style={{ ...TITLE, ...titleStyle }}
            text={header}
            numberOfLines={1}
          />
        </View>
        {rightIcon ? (
          <Button
            preset="icon"
            icon={rightIcon}
            onPress={onRightPress}
          />
        ) : (
          <View style={RIGHT}>
            {rightView}
          </View>
        )}
      </View>
    )
  }
}
